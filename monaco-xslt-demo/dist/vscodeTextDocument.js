define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VSCodeTextDocument = exports.VSCodePosition = void 0;
    var VSCodePosition = /** @class */ (function () {
        function VSCodePosition(line, character) {
            this.line = line;
            this.character = character;
        }
        VSCodePosition.prototype.isBefore = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.isBeforeOrEqual = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.isAfter = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.isAfterOrEqual = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.isEqual = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.compareTo = function (other) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.translate = function (lineDelta, characterDelta) {
            throw new Error('Method not implemented.');
        };
        VSCodePosition.prototype.with = function (line, character) {
            throw new Error('Method not implemented.');
        };
        return VSCodePosition;
    }());
    exports.VSCodePosition = VSCodePosition;
    var VSCodeTextDocument = /** @class */ (function () {
        function VSCodeTextDocument() {
        }
        VSCodeTextDocument.prototype.save = function () {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.lineAt = function (position) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.offsetAt = function (position) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.positionAt = function (offset) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.getText = function (range) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.getWordRangeAtPosition = function (position, regex) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.validateRange = function (range) {
            throw new Error('Method not implemented.');
        };
        VSCodeTextDocument.prototype.validatePosition = function (position) {
            throw new Error('Method not implemented.');
        };
        return VSCodeTextDocument;
    }());
    exports.VSCodeTextDocument = VSCodeTextDocument;
});
//# sourceMappingURL=vscodeTextDocument.js.map