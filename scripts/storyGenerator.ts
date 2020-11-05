import { promises, writeFile } from "fs";
import { join } from "path";
import * as ts from "typescript";

const filePath = 'src/components/Txt/index.tsx';

interface GeneratorEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: GeneratorEntry[];
  parameters?: GeneratorEntry[];
  returnType?: string;
}

type Declarations = {[key: string]: GeneratorEntry};

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
			files.push({fileName, filePath});
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

  generateStoryFile(declarations, componentName, filePath);

  function visit(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration:
        storeDeclaration(node as ts.InterfaceDeclaration);
        break;
      case ts.SyntaxKind.EnumDeclaration:
        storeDeclaration(node as ts.EnumDeclaration);
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        storeDeclaration(node as ts.TypeAliasDeclaration);
        break;
      default:
        break;
    }
  }

  function storeDeclaration(node: ts.InterfaceDeclaration | ts.EnumDeclaration | ts.TypeAliasDeclaration ) {
    const nodeName = node.name.escapedText.toString();
    const type = checker.getTypeAtLocation(node);
    const componentProps = type.getSymbol()?.members;
    componentProps?.forEach((symbol) => {
      if (symbol && nodeName) {
        declarations[nodeName] = {...declarations[nodeName], ...serializeInterface(symbol)};
      }
    });
  }

  function serializeSymbolType(symbol: ts.Symbol) {
    return checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    );
  }

  // /** Serialize a symbol into a json object */
  // function serializeSymbolWithDocumentation(symbol: ts.Symbol): DocEntry {
  //   return {
  //     name: symbol.getName(),
  //     documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
  //     type: serializeSymbolType(symbol)
  //   };
  // }
  
  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol) {
    const symbolName = symbol.getName();
    return {
      [symbolName] : {
        name: symbolName,
        type: serializeSymbolType(symbol)
      }
    };
  }

  /** Serialize an interface symbol information */
  function serializeInterface(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);
    return details;
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
    console.log(declarations)
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
    console.log(template);
  }
}

// 	const files = await getFilesInDirectory(DIR);
// 	const filteredFiles = files?.filter(file => file.filePath.includes('index.tsx'));
if(!filePath) {
navigateSourceFile(filePath, {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});
}


const generateMocks = async () => {
  const dir = './src/components';
 	const files = await getFilesInDirectory(dir);
	const filteredFiles = files?.filter(file => file.filePath.includes('index.tsx')); 
  const mocks = filteredFiles?.reduce((acc: {[key: string]: any}, cur) => {
    const componentName = cur.filePath.split('/')[2];
    acc[componentName.toLowerCase()] = {};
    return acc;
  }, {})
  writeFile('./src/mocks.json', JSON.stringify(mocks), function (err) {
    if (err) return console.log(err);
    console.log('Mocks created');
  });
}

generateMocks();
