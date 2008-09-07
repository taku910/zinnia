use ExtUtils::MakeMaker;
WriteMakefile(
    'NAME'		=> 'zinnia',
    'CC'                => 'c++',
    'LD'                => 'c++',
    'INC'               => '',
    'LIBS'              => '-lzinnia',
#    'VERSION'	        => '0.1',
    'OBJECT'            => 'zinnia_wrap.o' 
);
