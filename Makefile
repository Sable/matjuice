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

SRC_FILES := $(shell find . -type f -name '*.java')

all: matjuice.jar matjuice.sh jslib

matjuice.jar: generate_ast matjuice
	jar cf $(MATJUICE_JAR) -C bin matjuice

matjuice.sh: matjuice.jar
	@echo "$$MATJUICE_SCRIPT" > $(MATJUICE_SH)
	chmod +x $(MATJUICE_SH)

jslib: src/matjuice/lib/lib.sjs
	sjs -o $(GEN_DIR)/lib.js -r $<

matjuice: $(SRC_FILES)
	mkdir -p $(BUILD_DIR)
	javac -d $(BUILD_DIR) -cp $(NATLAB_PATH)/McLabCore.jar $(GEN_DIR)/matjuice/jsast/*.java $^

generate_ast: src/matjuice/jsast/Javascript.ast src/matjuice/jsast/JavascriptPretty.jadd src/matjuice/jsast/JavascriptVisitor.jadd
	mkdir -p $(GEN_DIR)
	java -jar $(MCLAB_CORE_PATH)/lib/jastadd2-2.1.9/jastadd2.jar --o $(GEN_DIR) --package=matjuice.jsast $^

clean:
	rm -rf $(BUILD_DIR) $(GEN_DIR) $(MATJUICE_JAR) $(MATJUICE_SH)


.PHONY: all clean generate_ast matjuice jslib
