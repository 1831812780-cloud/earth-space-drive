#!/bin/zsh
cd "${0:A:h}"
export PATH="$PWD/.tools/bin:$PATH"
npm run dev
