import { DocumentTypes } from './xslLexer';
export interface SimpleType {
    base?: string[];
    enum?: string[];
    list?: string;
    detail?: {
        [name: string]: string;
    };
}
export interface ComplexType {
    attrs?: any;
    base?: string;
    type?: string;
    elementNames?: string[];
    attributeList?: AttributeItem[];
    primitive?: string;
    detail?: string;
    attributeGroup?: string;
}
export interface SubstitutionGroupType {
    type: string;
    elements: {
        [name: string]: ComplexType;
    };
}
export interface AttributeItem {
    name: string;
    enum?: string[];
}
export interface SchemaData {
    attributeGroups: {
        [name: string]: any;
    };
    simpleTypes: {
        [name: string]: SimpleType;
    };
    complexTypes: {
        [name: string]: ComplexType;
    };
    substitutionGroups?: {
        [name: string]: SubstitutionGroupType;
    };
    elements: {
        [name: string]: ComplexType;
    };
    docType: DocumentTypes;
}
export declare class XSLTSchema implements SchemaData {
    docType: DocumentTypes;
    attributeGroups: {
        [name: string]: any;
    };
    simpleTypes: {
        [name: string]: SimpleType;
    };
    complexTypes: {
        [name: string]: ComplexType;
    };
    substitutionGroups: {
        [name: string]: SubstitutionGroupType;
    };
    elements: {
        [name: string]: ComplexType;
    };
}
