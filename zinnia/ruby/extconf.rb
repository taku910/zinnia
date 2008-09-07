require 'mkmf'

zinnia_config = with_config('zinnia-config', 'zinnia-config')
use_zinnia_config = enable_config('zinnia-config')
have_library("zinnia")
have_header('zinnia.h') && create_makefile('zinnia')
