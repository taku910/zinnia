%module zinnia
%include exception.i
%{
#include "zinnia.h"
%}

// %newobject zinnia::Recognizer::classify;
%newobject classify;
%newobject toString;

%exception {
  try { $action }
  catch (char *e) { SWIG_exception (SWIG_RuntimeError, e); }
  catch (const char *e) { SWIG_exception (SWIG_RuntimeError, (char*)e); }
}

%feature("notabstract") zinnia::Trainer;
%feature("notabstract") zinnia::Recognizer;
%feature("notabstract") zinnia::Character;

%extend zinnia::Trainer    { Trainer(void); }
%extend zinnia::Recognizer { Recognizer(void); }
%extend zinnia::Character    {
  Character(void);
  char *toString() {
    char buf[8192 * 16];
    if (!self->toString(buf, sizeof(buf)))
      return 0;
    char *r = new char[strlen(buf) + 1];
    strcpy(r, buf);
    return r; 
  }
}

%{

void delete_zinnia_Trainer (zinnia::Trainer *t) {
  delete t;
  t = 0;
}

zinnia::Trainer* new_zinnia_Trainer () {
  return zinnia::Trainer::create();
}

void delete_zinnia_Recognizer(zinnia::Recognizer *t) {
  delete t;
  t = 0;
}

zinnia::Recognizer* new_zinnia_Recognizer () {
  return zinnia::Recognizer::create();
}

void delete_zinnia_Character(zinnia::Character *t) {
  delete t;
  t = 0;
}

zinnia::Character* new_zinnia_Character() {
  return zinnia::Character::create();
}

%}

%include ../zinnia.h
%include version.h
