export declare enum XSLTnamespaces {
    NotDefined = 0,
    Array = 1,
    ExpathArchive = 2,
    ExpathBinary = 3,
    ExpathFile = 4,
    Map = 5,
    Math = 6,
    Saxon = 7,
    SQL = 8,
    XMLSchema = 9,
    XPath = 10,
    XSLT = 11,
    IXSL = 12
}
export declare class FunctionData {
    static readonly xpath: string[];
    static readonly array: string[];
    static readonly map: string[];
    static readonly ixsl: string[];
    static readonly math: string[];
    static readonly schema: string[];
    private static unionSimpleTypes;
    static readonly simpleTypes: string[];
    static readonly namespaces: Map<string, XSLTnamespaces>;
    static readonly ixslEventName: string[];
}
