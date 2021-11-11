import { SchemaData } from './xsltschema';
import { DocumentTypes } from './xslLexer';
export declare class Expected {
    elements: [string, string][];
    attrs: string[];
    attributeValues: [string, string][];
    foundAttributes: string[];
}
export declare class SchemaQuery {
    private schema;
    soughtAttributes: string[];
    emptyElements: string[];
    docType: DocumentTypes;
    constructor(schemaData: SchemaData);
    getExpected(name: string, attributeName?: string): Expected;
    private addElementDetails;
    private collectAttributeDetails;
    private lookupBaseType;
    private lookupSimpleType;
    private mergeAttrArrays;
    private performSubstitutions;
}
