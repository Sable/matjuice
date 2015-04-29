BUILD_DIR := bin
GEN_DIR := gen
MATJUICE_JAR := matjuice.jar
MATJUICE_SH := matjuice.sh
MCLAB_CORE_PATH ?= $(HOME)/workspace/mclab-core
NATLAB_PATH := $(MCLAB_CORE_PATH)/languages/Natlab

define MATJUICE_SCRIPT
#!/bin/bash

java -cp matjuice.jar:$(NATLAB_PATH)/McLabCore.jar matjuice.Main $*
endef

export MATJUICE_SCRIPT

SRC :=								\
	./src/matjuice/Main.java				\
	./src/matjuice/pretty/PrettyText.java			\
	./src/matjuice/pretty/Pretty.java			\
	./src/matjuice/pretty/Pair.java				\
	./src/matjuice/pretty/PrettyConcat.java			\
	./src/matjuice/pretty/PrettyBase.java			\
	./src/matjuice/pretty/PrettyLine.java			\
	./src/matjuice/pretty/PrettyIndent.java			\
	./src/matjuice/codegen/JSASTGenerator.java		\
	./src/matjuice/transformers/JSAddVarDecls.java		\
	./src/matjuice/transformers/JSRenameBuiltins.java

all: matjuice.jar matjuice.sh jslib

matjuice.jar: generate_ast matjuice
	jar cf $(MATJUICE_JAR) -C bin matjuice

matjuice.sh: matjuice.jar
	@echo "$$MATJUICE_SCRIPT" > $(MATJUICE_SH)
	chmod +x $(MATJUICE_SH)

jslib: src/matjuice/lib/lib.sjs
	sjs -o $(GEN_DIR)/lib.js -r $<

matjuice: $(SRC)
	mkdir -p $(BUILD_DIR)
	javac -d $(BUILD_DIR) -cp $(NATLAB_PATH)/McLabCore.jar $(GEN_DIR)/matjuice/jsast/*.java $^

generate_ast: src/matjuice/jsast/Javascript.ast src/matjuice/jsast/JavascriptPretty.jadd
	mkdir -p $(GEN_DIR)
	java -jar $(MCLAB_CORE_PATH)/lib/jastadd2-2.1.9/jastadd2.jar --o $(GEN_DIR) --package=matjuice.jsast $^

clean:
	rm -rf $(BUILD_DIR) $(GEN_DIR) $(MATJUICE_JAR) $(MATJUICE_SH)


.PHONY: all clean generate_ast matjuice jslib
