import * as cxml from "@wikipathways/cxml";
import * as aemoSchema from "./xmlns/aseXML/r44";
import fs from "fs";

const exampleXml = fs.readFileSync("./xmlMessageExamples/c4.xml", "utf8");

var parser = new cxml.Parser();

const runExample = async () => {
  try {
    var result = await parser.parse(exampleXml, aemoSchema.document);
    result.aseXML.Transactions.Transaction.forEach(processTransaction);
  } catch (e) {
    console.error(e);
  }
};

const processTransaction = (transaction: aemoSchema.Transaction) => {
  const transactionType = getTransactionType(transaction);
  switch (transactionType) {
    case "CATSNotification":
      return processCATSNotification(transaction.CATSNotification);
    case "ReportResponse":
      return processReportResponse(transaction.ReportResponse);
    default:
      return;
  }
};

function processCATSNotification(transaction: aemoSchema.CATSNotification) {
  console.log(transaction);
}

function processReportResponse(transaction: aemoSchema.ReportResponse) {
  console.log(transaction);
}

//  === Slightly clunky bit due to the way the objects are generated ===
const transactionAdditionalProperties = [
  "initiatingTransactionID",
  "transactionDate",
  "transactionID",
  "constructor",
  "_namespace",
  "_exists",
] as const;

type TransactionTypes = keyof Omit<
  aemoSchema.Transaction,
  (typeof transactionAdditionalProperties)[number]
>;

function getTransactionType(
  transaction: aemoSchema.Transaction
): TransactionTypes {
  return Object.keys(transaction).find(
    (key) => !transactionAdditionalProperties.includes(key as any)
  ) as TransactionTypes;
}

runExample();
