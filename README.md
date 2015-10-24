# RegisterForm
Repo for CSC-591 Milestone 2.

###Group Members
1. Abidaan Nagawkar (ajnagawk)
2. Shivaji Vidhale (savidhal)
3. Sushil Ganesh (sganesh4)

###Test
####Unit Testing
The Unit Test is described in the file 'unitTest.js'. The Jenkins Server is configured to automatically run this test each time new code is committed to the repository. The success or failure of the build dependends on whether the unit test passes or fails.

####Advanced Testing Technique and Coverage Report
We have implemented Constraint-Based Test Generation in order to improve testing coverage (main.js). With this technique, constraints on the argument list of various methods are taken into consideration and test cases are automatically generated. These test cases improve testing coverage as various (correct and incorrect) permutations of argument values are passed to individual methods in the code.
At the end of testing, a coverage report is displayed which shows statistics such as Branch Coverage, Statement Coverage, etc.

####Testing Gate
We have implemented a simple testing gate (testCoverage.sh), which will result in build failure if branch coverage is less than 75%.

####Security Token Gate
We don't want to commit any code that has any access keys hard-coded as these keys can be misused. Therefore, we have implemented a pre-commit git hook (checkKeys.js) that checks the code for any such keys and rejects the commit if any are found.

####Screencast: Details of the App and demonstration of Security Gate
[![AppDetails](http://img.youtube.com/vi/b9jQ2Wia8rw/0.jpg)](https://www.youtube.com/watch?v=b9jQ2Wia8rw)

####Screencast: Unit Testing, Coverage and Testing Gate
[![Test](http://img.youtube.com/vi/drQ1fLJktCk/0.jpg)](https://www.youtube.com/watch?v=drQ1fLJktCk)

###Analysis
####Base Analysis using existing Static Analysis Tools
ESLint has been used in order to perform a static analysis of the application (scripts/statisAnalysis.sh). This script basically runs ESLint on our application code and displays the results on the console as warnings or errors. The build fails if ESLint finds any errors but in our configuration, warnings do not fail the build. 

####Extended Analysis
We have implemented a simple extended analysis (main.js, scripts/extendedAnalysis.sh) which displays the ratio of comments to actual code. In the main.js file, we have modified the options that we pass to esprima to include comments as well. We have written simple code that counts the number of comments (single-line) or the number of lines of comments (multi-line). Our extendedAnalysis.sh script basically counts the total number of lines of code and subtracts the number of comments to display the ratio of comments to actual code.

####Analysis Gate
In our base analysis, we had configured ESLint to recognize Mocha keywords by making changes to the '.eslintrc' file. If this configuration is not made, ESLint will throw errors whenever it encounters Mocha code. In this way, we can configure ESLint to cause the build to fail if certain conditions are not satisfied.

####Screencast: Base Analysis, Extended Analysis and Analysis Gate
[![Analysis](http://img.youtube.com/vi/MMOrcloQWig/0.jpg)](https://www.youtube.com/watch?v=MMOrcloQWig)

