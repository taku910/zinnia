EXTRA_DIST = README Makefile.msvc.in
EXTRA_DIRS = swig perl python ruby sdk doc
bin_PROGRAMS = zinnia zinnia_learn zinnia_convert

AUTOMAKE_OPTIONS = no-dependencies
lib_LTLIBRARIES = libzinnia.la
libzinnia_la_SOURCES = feature.h param.cpp recognizer.cpp stream_wrapper.h \
                      svm.cpp sexp.cpp sexp.h zinnia.h feature.cpp libzinnia.cpp  mmap.h common.h \
		      param.h freelist.h scoped_ptr.h character.cpp svm.h  trainer.cpp
include_HEADERS = zinnia.h

dist-hook:
	for subdir in $(EXTRA_DIRS); do \
	  cp -rp $$subdir $(distdir); \
	  rm -f $(distdir)/$$subdir/*~; \
	  rm -f $(distdir)/$$subdir/*.{bak,orig}; \
	  rm -rf $(distdir)/$$subdir/CVS; \
	  rm -rf $(distdir)/$$subdir/.svn; \
	  rm -rf $(distdir)/.svn; \
	  rm -rf $(distdir)/*/.svn; \
	  rm -rf $(distdir)/*/*/.svn; \
	  rm -rf $(distdir)/$$subdir/*/CVS; \
	  rm -rf $(distdir)/$$subdir/*/.svn; \
	  find $(distdir) -name .svn  | xargs rm -fr; \
	done

win:
#	(cd src; rm -f *.exe *.obj *.dll)
#	(cd src; wcmd /c make.bat)

win-dist:
	rm -f @PACKAGE@-@VERSION@.zip
	mkdir -p @PACKAGE@-@VERSION@/doc
	mkdir -p @PACKAGE@-@VERSION@/sdk
	cp -f zinnia_learn.exe @PACKAGE@-@VERSION@
	cp -f zinnia_convert.exe @PACKAGE@-@VERSION@
	cp -f zinnia.exe @PACKAGE@-@VERSION@
	cp -f libzinnia.dll @PACKAGE@-@VERSION@
	cp -f libzinnia.lib @PACKAGE@-@VERSION@/sdk
	cp -f zinnia.h @PACKAGE@-@VERSION@/sdk
	cp -fr doc/*.html doc/*.css doc/doxygen @PACKAGE@-@VERSION@/doc
	cp -f README COPYING AUTHORS BSD @PACKAGE@-@VERSION@
	cp -fr sdk/*.cpp @PACKAGE@-@VERSION@/sdk
	cp -fr sdk/*.c @PACKAGE@-@VERSION@/sdk
	find @PACKAGE@-@VERSION@ -name CVS | xargs rm -rf
	find @PACKAGE@-@VERSION@ -name .svn | xargs rm -rr
	zip -r @PACKAGE@-win32-@VERSION@.zip @PACKAGE@-@VERSION@
	rm -fr @PACKAGE@-@VERSION@

zinnia_SOURCES = zinnia.cpp
zinnia_LDADD = libzinnia.la

zinnia_learn_SOURCES = zinnia_learn.cpp
zinnia_learn_LDADD = libzinnia.la

zinnia_convert_SOURCES = zinnia_convert.cpp

zinnia_convert_LDADD = libzinnia.la


dist-all-package:
	(test -f Makefile) && $(MAKE) distclean
	./configure
	$(MAKE) dist
	$(MAKE) clean
	$(MAKE) script-clean
#	$(MAKE) script-dist
	$(MAKE) win
	$(MAKE) win-dist

script-dist:
	for subdir in perl ruby python ; do \
	  rm -fr zinnia-$${subdir}-@VERSION@; \
	  mkdir zinnia-$${subdir}-@VERSION@; \
	  cp -r $${subdir}/* zinnia-$${subdir}-@VERSION@; \
	  cp -r doc/bindings.html  zinnia-$${subdir}-@VERSION@; \
	  find ./zinnia-$${subdir}-@VERSION@ -type d -name CVS | xargs rm -fr; \
	  rm -f zinnia-$${subdir}-@VERSION@/*~; \
	  tar zcfv zinnia-$${subdir}-@VERSION@.tar.gz zinnia-$${subdir}-@VERSION@; \
	  rm -fr zinnia-$${subdir}-@VERSION@; \
	done

script-clean:
	(cd perl; $(MAKE) clean; rm -f Makefile.old Makefile)
	(cd ruby; $(MAKE) clean; rm -f Makefile *.log)
	(cd python; python setup.py clean --all)
#	(cd java; $(MAKE) clean;)

export-package:
	./upload.pl -p zinnia -n zinnia        -r @VERSION@ -f zinnia-@VERSION@.tar.gz
	./upload.pl -p zinnia -n zinnia-win32  -r @VERSION@ -f zinnia-win32-@VERSION@.zip
	scp doc/*.html sf:public_html/zinnia/
	scp doc/*.css sf:public_html/zinnia/
	scp -r doc/doxygen sf:public_html/zinnia/
