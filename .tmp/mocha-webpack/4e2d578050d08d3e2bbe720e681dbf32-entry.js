
    var testsContext = require.context("../../src", false);

    var runnable = testsContext.keys();

    runnable.forEach(testsContext);
    