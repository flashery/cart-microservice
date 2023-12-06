# Cart API

This API provides endpoints to retrieve services and related data.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Prerequisites

* AWS account with necessary permissions to create and deploy AWS CloudFormation stacks
* Node.js v12 or later
* AWS CLI
* AWS CDK

## Installation

### Clone the repository:
```
git clone <repository-url>
```
### Install the dependencies:
```
npm install
```
### Setup Husky

```
npm run prepare
```
### To check for the test code coverage

npm run test-coverage

### To check the test code coverage in Browser with UI

npm run test-view

## Configuration (Optional)

1. Open the terminal and navigate to the project directory.
2. Run the following command to bootstrap the AWS environment:
```
cdk bootstrap aws://<AWS-Region>/<AWS-Account-ID>
```
	Need to only run this once for every new region to deploy to.
3. Configure the AWS credentials in your environment using the AWS CLI:
```
aws configure
```
4. Deploy the stack using the following command:
```
cdk deploy
```
	Deployment to environment will depend on what branch you're in, if you run the command in staging branch then it will start deployment to the staging environment.
	
## Usage

The API provides the following endpoints:

* GET /services: Retrieves a list of services.
* GET /services/:service_name/:service_type: Retrieves a list of services by name and type.
* GET /services/:service_name: Retrieves a list of services by name.
* POST /services: Retrieves a list of services by query parameters.
* GET /options/:question_name: Retrieves options for a particular question.

To start the API server, run the following command:

```
npm run start
```

## Linting and Formatting

The codebase uses TSLint for linting and Prettier for code formatting. To run the linter and fix formatting issues, use the following commands:

```
npm run lint
npm run lint:fix
```

To format the codebase using Prettier, use the following command:

```
npm run format
```

## Testing

To run the tests, use the following command:

```
npm run test
```

## Deployment

The API is deployed automatically when you push changes to the dev, staging, or master branch using Bitbucket Pipelines.

## Contributing

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a new branch with your changes: git checkout -b my-feature-branch
3. Commit your changes: git commit -am 'Add some feature'
4. Push the changes to your branch: git push origin my-feature-branch
5. Submit a pull request.