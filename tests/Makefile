all:
	@mkdir -p bin
	@javac -d bin -cp ../matjuice.jar:/home/vince/workspace/mclab-core/languages/Natlab/McLabCore.jar:deps/junit-4.12.jar:deps/hamcrest-core-1.3.jar *.java
	@java -cp ../matjuice.jar:/home/vince/workspace/mclab-core/languages/Natlab/McLabCore.jar:deps/junit-4.12.jar:deps/hamcrest-core-1.3.jar:bin TestRunner

clean:
	rm -rf bin

.PHONY: all clean
