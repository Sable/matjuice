BUILD_DIR=bin
GEN_DIR=gen
MCLAB_CORE_PATH=$(HOME)/workspace/mclab-core
NATLAB_PATH=$(MCLAB_CORE_PATH)/languages/Natlab
SRC=								\
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

all: generate_ast matjuice

matjuice: $(SRC)
	mkdir -p $(BUILD_DIR)
	javac -d $(BUILD_DIR) -cp $(NATLAB_PATH)/McLabCore.jar $(GEN_DIR)/matjuice/jsast/*.java $^

generate_ast: src/matjuice/jsast/Javascript.ast src/matjuice/jsast/JavascriptPretty.jadd
	mkdir -p $(GEN_DIR)
	java -jar $(MCLAB_CORE_PATH)/lib/jastadd2-2.1.9/jastadd2.jar --o $(GEN_DIR) --package=matjuice.jsast $^

clean:
	rm -rf $(BUILD_DIR) $(GEN_DIR)
