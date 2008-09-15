modeldir   = @prefix@/lib/zinnia/model/tomoe
model_DATA = @ZINNIA_GENDATA@
EXTRA_DIST = @ZINNIA_TEXT_MODEL@ *.s
CLEANFILES = *.model *.model.tmp
SUFFIXES = .txt .model

@ZINNIA_GENDATA@:
	@ZINNIA_CONVERT@ $*.model.txt $@

export-package:
	./upload.pl -p zinnia -n zinnia-tomoe  -r @VERSION@ -f zinnia-tomoe-@VERSION@.tar.bz2

