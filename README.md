# MatJuice

## Introduction

MatJuice is a backend for the McLab framework that translates MatLab
code into JavaScript code.

## Compilation

MatJuice requires [mclab-core](https://github.com/Sable/mclab-core) to
be installed.

    $ make clean
    $ MCLAB_CORE_PATH=/path/to/mclab-core make

## Execution

    $ java -cp matjuice.jar matjuice.Main <shape> <input file> <output file>
