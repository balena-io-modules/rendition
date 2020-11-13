import { promises, writeFile } from "fs";
// import { flatMap, map } from "lodash";
import { join } from "path";
import * as ts from "typescript";

const filePath = 'src/components/Txt/index.tsx';
const getStoryPath = (componentName: string) => `https://github.com/balena-io-modules/rendition/blob/master/src/components/${componentName}/story.js`

interface GeneratorEntry {
  name: string;
  fileName?: string;
  documentation?: string;
  type: string | string[];
  constructors?: GeneratorEntry[];
  parameters?: GeneratorEntry[];
  returnType?: string;
}

type Declarations = { [key: string]: GeneratorEntry } | { [key: string]: { [key: string]: GeneratorEntry } };

interface FileInfo {
  fileName: string,
  filePath: string
}

//UTILS
const checkFileExists = async (dir: string) => {
  try {
    await promises.access(dir);
    return true;
  } catch {
    console.error(`Specified directory: ${dir} does not exist`);
    return false;
  }
};

const getFilesInDirectory = async (dir: string) => {
  if (!checkFileExists(dir)) {
    return;
  }
  const files: FileInfo[] = [];
  const directory = await promises.readdir(dir);
  for (const fileName of directory) {
    const filePath = join(dir, fileName);
    const stat = await promises.lstat(filePath);
    if (stat.isDirectory()) {
      const nestedFile = await getFilesInDirectory(filePath) ?? [];
      files.push(...nestedFile);
    } else {
      files.push({ fileName, filePath });
    }
  }
  return files;
};

//GENERATOR
/** Generate story and documentation files */
function navigateSourceFile(
  filePath: string,
  options: ts.CompilerOptions
): void {
  // Build a program using the set of root file names in filePath
  let program = ts.createProgram([filePath], options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  // All declarations found in the sourceFile
  let declarations: Declarations = {};

  let mainDescription: string = '';

  const sourceFiles = program.getSourceFiles();

  //TODO: let's find a better way to extract the component name...
  const componentName = filePath.split('/')[2];
  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }
  
  console.log(mainDescription);
  generateStoryFile(declarations, componentName, filePath);
  const componentFolderPath = filePath.substring(0, filePath.lastIndexOf('/'));
  writeFile(`${componentFolderPath}/README2.md`, generateReadmeFile(declarations), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  function visit(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration:
        storeInterfaceDeclaration(node as ts.InterfaceDeclaration);
        break;
      case ts.SyntaxKind.EnumDeclaration:
        //evaluate enum
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        storeTypeDeclaration(node as ts.TypeAliasDeclaration);
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        storeTypeDeclaration(node as ts.TypeAliasDeclaration);
        break;
      case ts.SyntaxKind.ExportDeclaration:
        break;
      default:
        break;
    }
  }

  function storeInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    const nodeName = node.name.escapedText.toString();
    const type = checker.getTypeAtLocation(node);
    const typeSymbol = type.getSymbol();
    const componentProps = typeSymbol?.members;
    //TODO: check if there is a better way to declare a component description
    if(!mainDescription && typeSymbol) {
      mainDescription = ts.displayPartsToString(typeSymbol.getDocumentationComment(checker));
    }
    componentProps?.forEach((symbol) => {
      if (symbol && nodeName) {
        declarations[nodeName] = { ...declarations[nodeName], ...serializeSymbol(symbol) };
      }
    });
  }

  function storeTypeDeclaration(node: ts.TypeAliasDeclaration) {
    const nodeName = node.name.escapedText.toString();
    const type = checker.getTypeFromTypeNode(node.type);
    if(type.isUnion()) {
      declarations[nodeName] = {
        name: nodeName,
        type: type.types.map(t => checker.typeToString(t)),
      };
    }
  }

  function serializeSymbolType(symbol: ts.Symbol) {
    return checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    );
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol) {
    const symbolName = symbol.getName();
    return {
      [symbolName]: {
        name: symbolName,
        documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
        type: serializeSymbolType(symbol),
      }
    };
  }

  function isInterfaceStoredDeclaration (declarations: Declarations, type: string): boolean {
    return !declarations[type]?.name || !!declarations[type]?.name && typeof declarations[type]?.name === 'object';
  }

  function getInterfacePrimitivePropertiesTypes(declarations: Declarations, type: string): any {
    return Object.values(declarations[type]).map((declaration) => {
      return getPrimitiveType(declaration.type, declarations);
    })
  }

  function getPrimitiveType(type: string | string[], declarations: Declarations): string {
    const primitives = ['string', 'number', 'boolean'];
    if(Array.isArray(type)) {
      return type.map((t) => getPrimitiveType(t, declarations)).join(', ');
    }
    if (primitives.includes(type)){
      return type;
    }
    if(declarations[type] && isInterfaceStoredDeclaration(declarations, type)){
      return getInterfacePrimitivePropertiesTypes(declarations, type)
    } 
    if(declarations[type] && !isInterfaceStoredDeclaration(declarations, type)) {
      return getPrimitiveType((declarations[type] as GeneratorEntry).type, declarations);
    }
    return type;
  }

  function generateReadmeFile(declarations: Declarations) {
    const componentInterface = 'InternalTxtProps';
    const propsDocsArray = Object.values(declarations[componentInterface])?.map((declaration) => {
      return `| ${declaration.name} | ${getPrimitiveType(declaration.type, declarations)} | - | - | ${declaration.documentation} |`
    });

    return `# ${componentName} \n` +
      `${mainDescription} \n \n` +
      `[View story source](${getStoryPath(componentName)}) \n \n` +
      `## Props \n` +
      `| Name   | Type   | Default   | Required   | Description   | \n` +
      `| ------ | ------ | --------- | ---------- | ------------- | \n` +
      `${propsDocsArray.join('\n')}`
  }

  function generateComponentExamples(declarations: Declarations, componentName: string, componentPorpsInterfaceName: string) {
    return Object.values(declarations[componentPorpsInterfaceName])?.map((declaration) => {
      return `
      .add('${declaration.name}', () => {
        <Flex>
          <${componentName} ${declaration.name}=""/>
        </Flex>
      })
      `
    })
  }

  function generateStoryFile(declarations: Declarations, componentName: string, _filePath: string) {
    //TODO: should define a way to recognize it and be sure that the found one it's always the right one.
    const componentPorpsInterfaceName = Object.keys(declarations).find(key => key.includes(componentName));
    const template = componentPorpsInterfaceName && `
    import * as React from 'react'
    import { storiesOf } from '@storybook/react'
    import withReadme from 'storybook-readme/with-readme'
    import { Flex, Txt } from '../..'
    import Readme from './README.md'
    
    storiesOf('Next/Txt', module)
      .addDecorator(withReadme(Readme))
      ${generateComponentExamples(declarations, componentName, componentPorpsInterfaceName)}
    `
    return template;
  }
}

// 	const files = await getFilesInDirectory(DIR);
// 	const filteredFiles = files?.filter(file => file.filePath.includes('index.tsx'));
// if(!filePath) {
navigateSourceFile(filePath, {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});
// }


// const generateMocks = async () => {
//   const dir = './src/components';
//  	const files = await getFilesInDirectory(dir);
// 	const filteredFiles = files?.filter(file => file.filePath.includes('index.tsx')); 
//   const mocks = filteredFiles?.reduce((acc: {[key: string]: any}, cur) => {
//     const componentName = cur.filePath.split('/')[2];
//     acc[componentName.toLowerCase()] = {};
//     return acc;
//   }, {})
//   writeFile('./src/mocks.json', JSON.stringify(mocks), function (err) {
//     if (err) return console.log(err);
//     console.log('Mocks created');
//   });
// }

// generateMocks();



