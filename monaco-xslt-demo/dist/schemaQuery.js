define(["require", "exports", "./xslLexer"], function (require, exports, xslLexer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchemaQuery = exports.Expected = void 0;
    var Expected = /** @class */ (function () {
        function Expected() {
            this.elements = [];
            this.attrs = [];
            this.attributeValues = [];
            this.foundAttributes = [];
        }
        return Expected;
    }());
    exports.Expected = Expected;
    var SchemaQuery = /** @class */ (function () {
        function SchemaQuery(schemaData) {
            this.soughtAttributes = [];
            this.emptyElements = [];
            this.useIxsl = false;
            this.schema = schemaData;
            this.docType = schemaData.docType;
            switch (schemaData.docType) {
                case xslLexer_1.DocumentTypes.XSLT:
                    this.soughtAttributes = ['name', 'as', 'select', 'test', 'href'];
                    this.emptyElements = ['xsl:variable', 'xsl:value-of', 'xsl:param', 'xsl:sequence', 'xsl:attribute', 'xsl:output', 'xsl:apply-templates', 'xsl:with-param'];
                    break;
                case xslLexer_1.DocumentTypes.DCP:
                    this.soughtAttributes = ['name', 'defaultValue', 'literalValue', 'version', 'id', 'description', 'path'];
                    this.emptyElements = ['booleanParameter', 'stringParameter'];
                    break;
                default:
                    break;
            }
        }
        SchemaQuery.prototype.getExpected = function (name, attributeName) {
            var result = new Expected();
            var isXsltName = name.startsWith('xsl:') || name.startsWith('ixsl');
            if (this.schema.docType === xslLexer_1.DocumentTypes.XSLT && !isXsltName) {
                var attGroup = this.schema.attributeGroups['xsl:literal-result-element-attributes'];
                if (attGroup.attrs) {
                    this.mergeAttrArrays(result, Object.keys(attGroup.attrs));
                    if (attributeName) {
                        var simpleTypeName = attGroup.attrs[attributeName];
                        if (simpleTypeName) {
                            var sType = this.schema.simpleTypes[simpleTypeName];
                            if (sType) {
                                this.lookupSimpleType(sType, result);
                            }
                        }
                    }
                }
                return result;
            }
            if (this.schema.docType === xslLexer_1.DocumentTypes.SCH && !isXsltName) {
                var attGroupName = this.schema.elements[name] ? this.schema.elements[name].attributeGroup : undefined;
                if (attGroupName) {
                    var attGroup = this.schema.attributeGroups[attGroupName];
                    if (attGroup.attrs) {
                        this.mergeAttrArrays(result, Object.keys(attGroup.attrs));
                        if (attributeName) {
                            var simpleTypeName = attGroup.attrs[attributeName];
                            if (simpleTypeName) {
                                var sType = this.schema.simpleTypes[simpleTypeName];
                                if (sType) {
                                    this.lookupSimpleType(sType, result);
                                }
                            }
                        }
                    }
                }
            }
            name = name === 'xsl:stylesheet' ? 'xsl:transform' : name;
            var ct = this.schema.elements[name];
            if (ct) {
                this.addElementDetails(ct, result);
                this.collectAttributeDetails(ct, result, attributeName);
                var typeName = ct.type ? ct.type : ct.base;
                if (typeName) {
                    var type = this.schema.complexTypes[typeName];
                    if (type) {
                        this.addElementDetails(type, result);
                        if (type.base) {
                            this.lookupBaseType(type, result, attributeName);
                        }
                        if (type.attrs) {
                            this.mergeAttrArrays(result, Object.keys(type.attrs));
                            if (attributeName) {
                                var attrTypeName = type.attrs[attributeName];
                                if (attrTypeName) {
                                    if (attrTypeName === 'xs:boolean') {
                                        result.attributeValues.push(['true', '']);
                                        result.attributeValues.push(['false', '']);
                                    }
                                    else {
                                        var attrType = this.schema.simpleTypes[attrTypeName];
                                        if (attrType) {
                                            this.lookupSimpleType(attrType, result);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!ct && this.schema.substitutionGroups) {
                var isInstructionSg = true;
                var sgElement = this.schema.substitutionGroups.instruction.elements[name];
                if (!sgElement) {
                    isInstructionSg = false;
                    sgElement = this.schema.substitutionGroups.declaration.elements[name];
                }
                if (!sgElement) {
                    sgElement = this.schema.substitutionGroups.ixslInstruction.elements[name];
                }
                if (sgElement) {
                    this.collectAttributeDetails(sgElement, result, attributeName);
                    this.lookupBaseType(sgElement, result, attributeName);
                    var sgType = void 0;
                    if (isInstructionSg) {
                        sgType = this.schema.complexTypes['xsl:versioned-element-type'];
                    }
                    else {
                        sgType = this.schema.complexTypes['xsl:generic-element-type'];
                    }
                    if (sgType && sgType.base) {
                        this.lookupBaseType(sgType, result, attributeName);
                    }
                    if (sgType && sgType.attrs) {
                        this.mergeAttrArrays(result, Object.keys(sgType.attrs));
                    }
                    this.addElementDetails(sgElement, result);
                }
                else {
                    // literal result element - provide 'xsl:literal-result-element-attributes' attributeGoup?
                }
            }
            if (this.docType === xslLexer_1.DocumentTypes.XSLT) {
                result.elements = this.performSubstitutions(result.elements);
            }
            else if (this.docType === xslLexer_1.DocumentTypes.DCP) {
                // parameterRefGroup applies to all elements permitting literalValue attr
                if (result.attrs.indexOf('literalValue') !== -1) {
                    result.attrs.push('xpath');
                    result.attrs.push('parameterRef');
                }
            }
            return result;
        };
        SchemaQuery.prototype.addElementDetails = function (ct, result) {
            var _this = this;
            if (ct.elementNames) {
                ct.elementNames.forEach(function (name) {
                    var elementDefinition = _this.schema.elements[name];
                    var detail;
                    if (elementDefinition && elementDefinition.detail) {
                        detail = elementDefinition.detail;
                    }
                    var detailValue = detail ? detail : '';
                    var existing = result.elements.find(function (element) { return element[0] === name; });
                    if (!existing) {
                        result.elements.push([name, detailValue]);
                    }
                });
            }
        };
        SchemaQuery.prototype.collectAttributeDetails = function (ct, result, attributeName) {
            if (ct.attrs) {
                this.mergeAttrArrays(result, Object.keys(ct.attrs));
                if (attributeName) {
                    var simpleTypeName = ct.attrs[attributeName];
                    if (simpleTypeName) {
                        if (simpleTypeName === 'xs:boolean') {
                            result.attributeValues.push(['true', '']);
                            result.attributeValues.push(['false', '']);
                        }
                        else {
                            var sType = this.schema.simpleTypes[simpleTypeName];
                            if (sType) {
                                this.lookupSimpleType(sType, result);
                            }
                        }
                    }
                }
            }
            if (ct.attributeList) {
                var attNames_1 = [];
                var findAtt_1 = attributeName ? true : false;
                ct.attributeList.forEach(function (item) {
                    attNames_1.push(item.name);
                    if (findAtt_1 && item.name === attributeName) {
                        findAtt_1 = false;
                        if (item.enum) {
                            item.enum.forEach(function (attrValue) {
                                result.attributeValues.push([attrValue, '']);
                            });
                        }
                    }
                });
                this.mergeAttrArrays(result, attNames_1);
            }
        };
        SchemaQuery.prototype.lookupBaseType = function (sgType, result, attributeName) {
            var sgTypeBase = sgType.base ? sgType.base : sgType.type;
            if (sgTypeBase) {
                var baseType = this.schema.complexTypes[sgTypeBase];
                if (baseType && baseType.attrs) {
                    this.mergeAttrArrays(result, Object.keys(baseType.attrs));
                    if (attributeName) {
                        var attrType = baseType.attrs[attributeName];
                        if (attrType) {
                            var simpleType = this.schema.simpleTypes[attrType];
                            this.lookupSimpleType(simpleType, result);
                        }
                    }
                }
                if (baseType) {
                    this.addElementDetails(baseType, result);
                }
                // recursive call;
                if (baseType.base) {
                    this.lookupBaseType(baseType, result, attributeName);
                }
            }
        };
        SchemaQuery.prototype.lookupSimpleType = function (sgType, result) {
            if (sgType && sgType.enum) {
                sgType.enum.forEach(function (attrValue) {
                    var detail = '';
                    if (sgType.detail) {
                        var lookup = sgType.detail[attrValue];
                        detail = lookup ? lookup : '';
                    }
                    var existing = result.attributeValues.find(function (val) { return val[0] === attrValue; });
                    if (!existing) {
                        result.attributeValues.push([attrValue, detail]);
                    }
                });
            }
        };
        SchemaQuery.prototype.mergeAttrArrays = function (expected, source) {
            var _this = this;
            var target = expected.attrs;
            source.forEach(function (item) {
                if (target.indexOf(item) === -1) {
                    if (_this.soughtAttributes.indexOf(item) > -1) {
                        expected.foundAttributes.push(item);
                    }
                    target.push(item);
                }
            });
            return target;
        };
        SchemaQuery.prototype.performSubstitutions = function (elements) {
            var _this = this;
            var newElements = [];
            elements.forEach(function (item) {
                if (item[0] === 'xsl:instruction' && _this.schema.substitutionGroups) {
                    var subElements = Object.keys(_this.schema.substitutionGroups.instruction.elements);
                    newElements.push(['xsl:literal-result-element', '']);
                    subElements.forEach(function (se) { newElements.push([se, '']); });
                    if (_this.useIxsl) {
                        var subElements_1 = Object.keys(_this.schema.substitutionGroups.ixslInstruction.elements);
                        subElements_1.forEach(function (se) { newElements.push([se, '']); });
                    }
                }
                else if (item[0] === 'xsl:declaration' && _this.schema.substitutionGroups) {
                    var subElements = Object.keys(_this.schema.substitutionGroups.declaration.elements);
                    subElements.forEach(function (se) { newElements.push([se, '']); });
                }
                else {
                    newElements.push(item);
                }
            });
            return newElements;
        };
        return SchemaQuery;
    }());
    exports.SchemaQuery = SchemaQuery;
});
//# sourceMappingURL=schemaQuery.js.map