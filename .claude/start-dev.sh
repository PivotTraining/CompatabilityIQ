#!/bin/bash
export PATH="/usr/local/bin:$PATH"
cd "/Users/chrisdavis/Documents/Pivot Everything/CompatibleIQ"
exec node ./node_modules/.bin/next dev --turbopack -p 3000
