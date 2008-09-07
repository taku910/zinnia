#!/usr/bin/env python

from distutils.core import setup,Extension,os
import string

setup(name = "zinnia-python",
      py_modules=["zinnia"],
      ext_modules = [Extension("_zinnia",
                               ["zinnia_wrap.cxx",],
                               libraries=["zinnia"])
                     ])
