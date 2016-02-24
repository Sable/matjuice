# MatJuice

## Introduction

MatJuice is a backend for the McLab framework that translates MatLab
code into JavaScript code.

## Requirements

MatJuice requires [mclab-core](https://github.com/Sable/mclab-core) to
be installed and [sweet.js](http://sweetjs.org/)

    # Installing sweet.js
    $ npm install -g sweet.js

    # Installing mclab-core
    $ git clone https://github.com/Sable/mclab-core.git
    $ cd mclab-core/languages/Natlab
    $ ant jar

## Compiling MatJuice

Once sweet.js and mclab-core are installed, you can build MatJuice:

    $ make clean
    $ MCLAB_CORE_PATH=/path/to/mclab-core make

## Execution

    $ ./matjuice.sh <input file> <output file> <shape1 shape2 ... shapeN>
