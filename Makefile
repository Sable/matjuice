BUILD_DIR := bin
GEN_DIR := gen
MATJUICE_JAR := matjuice.jar
MATJUICE_SH := matjuice.sh
MCLAB_CORE_PATH ?= $(HOME)/workspace/mclab-core
NATLAB_PATH := $(MCLAB_CORE_PATH)/languages/Natlab

define MATJUICE_SCRIPT
#!/bin/bash

java -cp $(CURDIR)/matjuice.jar:$(NATLAB_PATH)/McLabCore.jar matjuice.Main $$*
endef

export MATJUICE_SCRIPT

#SRC_FILES := $(shell find . -type f -name '*.java')
SRC_FILES := src/matjuice/Main.java src/matjuice/analyses/LocalVars.java src/matjuice/codegen/Generator.java src/matjuice/codegen/RenameOperator.java src/matjuice/utils/Utils.java gen/matjuice/jsast/*.java

all: matjuice.jar matjuice.sh jslib

matjuice.jar: generate_ast matjuice jslib
	jar cf $(MATJUICE_JAR) -C bin matjuice
	jar uf $(MATJUICE_JAR) -C gen lib.js
	jar uf $(MATJUICE_JAR) -C src/matjuice/lib/ mjapi.js

matjuice.sh: matjuice.jar
	@echo "$$MATJUICE_SCRIPT" > $(MATJUICE_SH)
	chmod +x $(MATJUICE_SH)

jslib: src/matjuice/lib/lib.sjs
	sjs -o $(GEN_DIR)/lib.js -r $<

matjuice: $(SRC_FILES)
	mkdir -p $(BUILD_DIR)
	javac -g -d $(BUILD_DIR) -cp $(BUILD_DIR):$(NATLAB_PATH)/McLabCore.jar $(GEN_DIR)/matjuice/jsast/*.java $^

generate_ast: js_operators src/matjuice/jsast/Javascript.ast src/matjuice/jsast/JavascriptPretty.jadd
	mkdir -p $(GEN_DIR)
	java -jar $(MCLAB_CORE_PATH)/lib/jastadd2-2.1.9/jastadd2.jar --o $(GEN_DIR) --package=matjuice.jsast src/matjuice/jsast/Javascript.ast src/matjuice/jsast/JavascriptPretty.jadd

js_operators: pretty src/matjuice/jsast/Unop.java src/matjuice/jsast/Binop.java
	mkdir -p $(BUILD_DIR)
	javac -g -d $(BUILD_DIR) -cp $(BUILD_DIR) src/matjuice/jsast/Unop.java src/matjuice/jsast/Binop.java

pretty: src/matjuice/pretty/*.java
	mkdir -p $(BUILD_DIR)
	javac -g -d $(BUILD_DIR) $^

clean:
	rm -rf $(BUILD_DIR) $(GEN_DIR) $(MATJUICE_JAR) $(MATJUICE_SH)


.PHONY: all clean generate_ast matjuice jslib
