BUILD_DIR := bin
GEN_DIR := gen
SRC_DIR := src
MATJUICE_JAR := matjuice.jar
MATJUICE_SH := matjuice.sh
MCLAB_CORE_PATH ?= $(HOME)/workspace/mclab-core
NATLAB_PATH := $(MCLAB_CORE_PATH)/languages/Natlab

define MATJUICE_SCRIPT
#!/bin/bash

java -cp $(CURDIR)/matjuice.jar:$(NATLAB_PATH)/McLabCore.jar matjuice.Main $$*
endef

export MATJUICE_SCRIPT

AST_FILES	:= src/matjuice/jsast/Javascript.ast
JADD_FILES      := src/matjuice/jsast/JavascriptPretty.jadd
PRETTY_FILES	:= src/matjuice/pretty/*.java
SRC_FILES	:= src/matjuice/Main.java src/matjuice/analyses/*.java src/matjuice/codegen/*.java src/matjuice/utils/*.java

all:
	mkdir -p $(BUILD_DIR)
	mkdir -p $(GEN_DIR)
	javac -g -d $(BUILD_DIR) $(PRETTY_FILES)
	java -jar $(MCLAB_CORE_PATH)/lib/jastadd2-2.1.9/jastadd2.jar --o $(GEN_DIR) --package=matjuice.jsast $(AST_FILES) $(JADD_FILES)
	javac -g -d $(BUILD_DIR) -cp $(BUILD_DIR) $(GEN_DIR)/matjuice/jsast/*.java $(SRC_DIR)/matjuice/jsast/Binop.java $(SRC_DIR)/matjuice/jsast/Unop.java
	javac -g -d $(BUILD_DIR) -cp $(BUILD_DIR):$(NATLAB_PATH)/McLabCore.jar $(SRC_FILES)
	sjs -o $(GEN_DIR)/lib.js -r src/matjuice/lib/lib.sjs
	jar cf $(MATJUICE_JAR) -C bin matjuice
	jar uf $(MATJUICE_JAR) -C gen lib.js
	jar uf $(MATJUICE_JAR) -C src/matjuice/lib/ mjapi.js
	@echo "$$MATJUICE_SCRIPT" > $(MATJUICE_SH)
	chmod +x $(MATJUICE_SH)


clean:
	rm -rf $(BUILD_DIR) $(GEN_DIR) $(MATJUICE_JAR) $(MATJUICE_SH)


.PHONY: all clean
