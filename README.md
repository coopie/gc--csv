# gc->csv
returns a csv of payment information from the GoCardless sandbox

### Setup

To install dependencies:
```bash
npm install
```

### Running the Tests
To run the tests
```bash
npm test
```
This will also give coverage results from the files tested

### Running The Program
```bash
npm start <Authentication Token> [path]
```
Where the default path is `payments.csv`.

This will write the CSV containing payment information to the path.

The CSV contains:

- Payment ID
- Payment amount
- Payment description
- Customer first name
- Customer last name

For all payments in the GoCardless sandbox
