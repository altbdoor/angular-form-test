#!/bin/bash

CURRENT_DIR=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
cd "$CURRENT_DIR"

arg1="$1"

echo "> Concatenating"
css_path="static/css/pack.css"
css_files=(
	"node_modules/bootstrap/dist/css/bootstrap.min.css"
	"node_modules/angular/angular-csp.css"
	
	"node_modules/angular-moment-picker/dist/angular-moment-picker.min.css"
	"node_modules/simple-line-icons/css/simple-line-icons.css"
)

js_path="static/js/pack.js"
js_files=(
	"node_modules/angular/angular.js"
	"node_modules/angular-route/angular-route.js"
	"node_modules/angular-messages/angular-messages.js"
	
	"node_modules/angular-translate/dist/angular-translate.min.js"
	"node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"
	
	"node_modules/angular1-text-mask/dist/angular1TextMask.js"
	
	"node_modules/moment/min/moment-with-locales.min.js"
	"node_modules/angular-moment-picker/dist/angular-moment-picker.min.js"
	
	"node_modules/localforage/dist/localforage.min.js"
	"node_modules/angular-localforage/dist/angular-localForage.min.js"
)

> "$css_path"
> "$js_path"

for i in "${css_files[@]}"; do
	cat "$i" >> "$css_path"
done

for i in "${js_files[@]}"; do
	cat "$i" >> "$js_path"
done

echo "> Stripping source map"
sed -i -e '/\/\*# sourceMappingURL.*/d' "$css_path"
sed -i -e '/\/\/# sourceMappingURL.*/d' "$js_path"

echo "> Getting fonts"
mkdir -p static/fonts
cp node_modules/simple-line-icons/fonts/* static/fonts

if [[ "$arg1" == "compress" ]]; then
	echo "> Compressing"
	./node_modules/clean-css-cli/bin/cleancss -o "$css_path" "$css_path"
	./node_modules/uglify-js/bin/uglifyjs "$js_path" --compress --mangle --output "$js_path"
fi

echo "> Done"
