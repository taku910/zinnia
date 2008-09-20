//
//  Zinnia: Online hand recognition system with machine learning
//
//  $Id$;
//
//  Copyright(C) 2008 Taku Kudo <taku@chasen.org>
//
#ifndef zinnia_SVM_H_
#define zinnia_SVM_H_

namespace zinnia {
  struct FeatureNode;

  bool svm_train(size_t l,
                 size_t n,
                 const float *y,
                 const FeatureNode **x,
                 double C,
                 double *w);
}

#endif
