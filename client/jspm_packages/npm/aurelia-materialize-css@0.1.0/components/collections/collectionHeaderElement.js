/* */ 
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./../../config"], function (require, exports, aurelia_framework_1, config_1) {
    "use strict";
    var CollectionHeaderElement = (function () {
        function CollectionHeaderElement() {
        }
        CollectionHeaderElement.prototype.attached = function () {
            if (this.element.parentElement && !this.element.parentElement.classList.contains("with-header")) {
                this.element.parentElement.classList.add("with-header");
            }
        };
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', String)
        ], CollectionHeaderElement.prototype, "class", void 0);
        CollectionHeaderElement = __decorate([
            aurelia_framework_1.customElement(config_1.config.collectionHeader),
            aurelia_framework_1.containerless(),
            aurelia_framework_1.inlineView("<template><li class=\"collection-header ${class}\" ref=\"element\"><slot></slot></li></template>"), 
            __metadata('design:paramtypes', [])
        ], CollectionHeaderElement);
        return CollectionHeaderElement;
    }());
    exports.CollectionHeaderElement = CollectionHeaderElement;
});

//# sourceMappingURL=collectionHeaderElement.js.map
