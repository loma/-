// Copyright 2009 The Trustees of Indiana University.

// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

//  Authors: Jeremiah Willcock
//           Douglas Gregor
//           Andrew Lumsdaine
#ifndef BOOST_GRAPH_TOPOLOGY_HPP
#define BOOST_GRAPH_TOPOLOGY_HPP

#include <boost/config/no_tr1/cmath.hpp>
#include <cmath>
#include <boost/random/uniform_01.hpp>
#include <boost/random/linear_congruential.hpp>
#include <boost/math/constants/constants.hpp> // For root_two
#include <boost/algorithm/minmax.hpp>
#include <boost/config.hpp> // For BOOST_STATIC_CONSTANT
#include <boost/math/special_functions/hypot.hpp>

// Classes and concepts to represent points in a space, with distance and move
// operations (used for Gurson-Atun layout), plus other things like bounding
// boxes used for other layout algorithms.

namespace boost {

/***********************************************************
 * Topologies                                              *
 ***********************************************************/
template<std::size_t Dims>
class convex_topology 
{
  public: // For VisualAge C++
  struct point 
  {
    BOOST_STATIC_CONSTANT(std::size_t, dimensions = Dims);
    point() { }
    double& operator[](std::size_t i) {return values[i];}
    const double& operator[](std::size_t i) const {return values[i];}

  private:
    double values[Dims];
  };

  public: // For VisualAge C++
  struct point_difference
  {
    BOOST_STATIC_CONSTANT(std::size_t, dimensions = Dims);
    point_difference() {
      for (std::size_t i = 0; i < Dims; ++i) values[i] = 0.;
    }
    double& operator[](std::size_t i) {return values[i];}
    const double& operator[](std::size_t i) const {return values[i];}

    friend point_difference operator+(const point_difference& a, const point_difference& b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = a[i] + b[i];
      return result;
    }

    friend point_difference& operator+=(point_difference& a, const point_difference& b) {
      for (std::size_t i = 0; i < Dims; ++i)
        a[i] += b[i];
      return a;
    }

    friend point_difference operator-(const point_difference& a) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = -a[i];
      return result;
    }

    friend point_difference operator-(const point_difference& a, const point_difference& b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = a[i] - b[i];
      return result;
    }

    friend point_difference& operator-=(point_difference& a, const point_difference& b) {
      for (std::size_t i = 0; i < Dims; ++i)
        a[i] -= b[i];
      return a;
    }

    friend point_difference operator*(const point_difference& a, const point_difference& b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = a[i] * b[i];
      return result;
    }

    friend point_difference operator*(const point_difference& a, double b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = a[i] * b;
      return result;
    }

    friend point_difference operator*(double a, const point_difference& b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = a * b[i];
      return result;
    }

    friend point_difference operator/(const point_difference& a, const point_difference& b) {
      point_difference result;
      for (std::size_t i = 0; i < Dims; ++i)
        result[i] = (b[i] == 0.) ? 0. : a[i] / b[i];
      return result;
    }

    friend double dot(const point_difference& a, const point_difference& b) {
      double result = 0;
      for (std::size_t i = 0; i < Dims; ++i)
        result += a[i] * b[i];
      return result;
    }

  private:
    double values[Dims];
  };

 public:
  typedef point point_type;
  typedef point_difference point_difference_type;

  double distance(point a, point b) const 
  {
    double dist = 0.;
    for (std::size_t i = 0; i < Dims; ++i) {
      double diff = b[i] - a[i];
      dist = boost::math::hypot(dist, diff);
    }
    // Exact properties of the distance are not important, as long as
    // < on what this returns matches real distances; l_2 is used because
    // Fruchterman-Reingold also uses this code and it relies on l_2.
    return dist;
  }

  point move_position_toward(point a, double fraction, point b) const 
  {
    point result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = a[i] + (b[i] - a[i]) * fraction;
    return result;
  }

  point_difference difference(point a, point b) const {
    point_difference result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = a[i] - b[i];
    return result;
  }

  point adjust(point a, point_difference delta) const {
    point result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = a[i] + delta[i];
    return result;
  }

  point pointwise_min(point a, point b) const {
    BOOST_USING_STD_MIN();
    point result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = min BOOST_PREVENT_MACRO_SUBSTITUTION (a[i], b[i]);
    return result;
  }

  point pointwise_max(point a, point b) const {
    BOOST_USING_STD_MAX();
    point result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = max BOOST_PREVENT_MACRO_SUBSTITUTION (a[i], b[i]);
    return result;
  }

  double norm(point_difference delta) const {
    double n = 0.;
    for (std::size_t i = 0; i < Dims; ++i)
      n = boost::math::hypot(n, delta[i]);
    return n;
  }

  double volume(point_difference delta) const {
    double n = 1.;
    for (std::size_t i = 0; i < Dims; ++i)
      n *= delta[i];
    return n;
  }

};

template<std::size_t Dims,
         typename RandomNumberGenerator = minstd_rand>
class hypercube_topology : public convex_topology<Dims>
{
  typedef uniform_01<RandomNumberGenerator, double> rand_t;

 public:
  typedef typename convex_topology<Dims>::point_type point_type;
  typedef typename convex_topology<Dims>::point_difference_type point_difference_type;

  explicit hypercube_topology(double scaling = 1.0) 
    : gen_ptr(new RandomNumberGenerator), rand(new rand_t(*gen_ptr)), 
      scaling(scaling) 
  { }

  hypercube_topology(RandomNumberGenerator& gen, double scaling = 1.0) 
    : gen_ptr(), rand(new rand_t(gen)), scaling(scaling) { }
                     
  point_type random_point() const 
  {
    point_type p;
    for (std::size_t i = 0; i < Dims; ++i)
      p[i] = (*rand)() * scaling;
    return p;
  }

  point_type bound(point_type a) const
  {
    BOOST_USING_STD_MIN();
    BOOST_USING_STD_MAX();
    point_type p;
    for (std::size_t i = 0; i < Dims; ++i)
      p[i] = min BOOST_PREVENT_MACRO_SUBSTITUTION (scaling, max BOOST_PREVENT_MACRO_SUBSTITUTION (-scaling, a[i]));
    return p;
  }

  double distance_from_boundary(point_type a) const
  {
    BOOST_USING_STD_MIN();
    BOOST_USING_STD_MAX();
#ifndef BOOST_NO_STDC_NAMESPACE
    using std::abs;
#endif
    BOOST_STATIC_ASSERT (Dims >= 1);
    double dist = abs(scaling - a[0]);
    for (std::size_t i = 1; i < Dims; ++i)
      dist = min BOOST_PREVENT_MACRO_SUBSTITUTION (dist, abs(scaling - a[i]));
    return dist;
  }

  point_type center() const {
    point_type result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = scaling * .5;
    return result;
  }

  point_type origin() const {
    point_type result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = 0;
    return result;
  }

  point_difference_type extent() const {
    point_difference_type result;
    for (std::size_t i = 0; i < Dims; ++i)
      result[i] = scaling;
    return result;
  }

 private:
  shared_ptr<RandomNumberGenerator> gen_ptr;
  shared_ptr<rand_t> rand;
  double scaling;
};

template<typename RandomNumberGenerator = minstd_rand>
class square_topology : public hypercube_topology<2, RandomNumberGenerator>
{
  typedef hypercube_topology<2, RandomNumberGenerator> inherited;

 public:
  explicit square_topology(double scaling = 1.0) : inherited(scaling) { }
  
  square_topology(RandomNumberGenerator& gen, double scaling = 1.0) 
    : inherited(gen, scaling) { }
};

template<typename RandomNumberGenerator = minstd_rand>
class rectangle_topology : public convex_topology<2>
{
  typedef uniform_01<RandomNumberGenerator, double> rand_t;

  public:
  rectangle_topology(double left, double top, double right, double bottom)
    : gen_ptr(new RandomNumberGenerator), rand(new rand_t(*gen_ptr)),
      left(std::min BOOST_PREVENT_MACRO_SUBSTITUTION (left, right)),
      top(std::min BOOST_PREVENT_MACRO_SUBSTITUTION (top, bottom)),
      right(std::max BOOST_PREVENT_MACRO_SUBSTITUTION (left, right)),
      bottom(std::max BOOST_PREVENT_MACRO_SUBSTITUTION (top, bottom)) { }

  rectangle_topology(RandomNumberGenerator& gen, double left, double top, double right, double bottom)
    : gen_ptr(), rand(new rand_t(gen)),
      left(std::min BOOST_PREVENT_MACRO_SUBSTITUTION (left, right)),
      top(std::min BOOST_PREVENT_MACRO_SUBSTITUTION (top, bottom)),
      right(std::max BOOST_PREVENT_MACRO_SUBSTITUTION (left, right)),
      bottom(std::max BOOST_PREVENT_MACRO_SUBSTITUTION (top, bottom)) { }

  typedef typename convex_topology<2>::point_type point_type;
  typedef typename convex_topology<2>::point_difference_type point_difference_type;

  point_type random_point() const 
  {
    point_type p;
    p[0] = (*rand)() * (right - left) + left;
    p[1] = (*rand)() * (bottom - top) + top;
    return p;
  }

  point_type bound(point_type a) const
  {
    BOOST_USING_STD_MIN();
    BOOST_USING_STD_MAX();
    point_type p;
    p[0] = min BOOST_PREVENT_MACRO_SUBSTITUTION (right, max BOOST_PREVENT_MACRO_SUBSTITUTION (left, a[0]));
    p[1] = min BOOST_PREVENT_MACRO_SUBSTITUTION (bottom, max BOOST_PREVENT_MACRO_SUBSTITUTION (top, a[1]));
    return p;
  }

  double distance_from_boundary(point_type a) const
  {
    BOOST_USING_STD_MIN();
    BOOST_USING_STD_MAX();
#ifndef BOOST_NO_STDC_NAMESPACE
    using std::abs;
#endif
    double dist = abs(left - a[0]);
    dist = min BOOST_PREVENT_MACRO_SUBSTITUTION (dist, abs(right - a[0]));
    dist = min BOOST_PREVENT_MACRO_SUBSTITUTION (dist, abs(top - a[1]));
    dist = min BOOST_PREVENT_MACRO_SUBSTITUTION (dist, abs(bottom - a[1]));
    return dist;
  }

  point_type center() const {
    point_type result;
    result[0] = (left + right) / 2.;
    result[1] = (top + bottom) / 2.;
    return result;
  }

  point_type origin() const {
    point_type result;
    result[0] = left;
    result[1] = top;
    return result;
  }

  point_difference_type extent() const {
    point_difference_type result;
    result[0] = right - left;
    result[1] = bottom - top;
    return result;
  }

 private:
  shared_ptr<RandomNumberGenerator> gen_ptr;
  shared_ptr<rand_t> rand;
  double left, top, right, bottom;
};

template<typename RandomNumberGenerator = minstd_rand>
class cube_topology : public hypercube_topology<3, RandomNumberGenerator>
{
  typedef hypercube_topology<3, RandomNumberGenerator> inherited;

 public:
  explicit cube_topology(double scaling = 1.0) : inherited(scaling) { }
  
  cube_topology(RandomNumberGenerator& gen, double scaling = 1.0) 
    : inherited(gen, scaling) { }
};

template<std::size_t Dims,
         typename RandomNumberGenerator = minstd_rand>
class ball_topology : public convex_topology<Dims>
{
  typedef uniform_01<RandomNumberGenerator, double> rand_t;

 public:
  typedef typename convex_topology<Dims>::point_type point_type;
  typedef typename convex_topology<Dims>::point_difference_type point_difference_type;

  explicit ball_topology(double radius = 1.0) 
    : gen_ptr(new RandomNumberGenerator), rand(new rand_t(*gen_ptr)), 
      radius(radius) 
  { }

  ball_topology(RandomNumberGenerator& gen, double radius = 1.0) 
    : gen_ptr(), rand(new rand_t(gen)), radius(radius) { }
                     
  point_type random_point() const 
  {
    point_type p;
    double dist_sum;
    do {
      dist_sum = 0.0;
      for (std::size_t i = 0; i < Dims; ++i) {
        double x = (*rand)() * 2*radius - radius;
        p[i] = x;
        dist_sum += x * x;
      }
    } while (dist_sum > radius*radius);
    return p;
  }

  point_type bound(point_type a) const
  {
    BOOST_USING_STD_MIN();
    BOOST_USING_STD_MAX();
    double r = 0.;
    for (std::size_t i = 0; i < Dims; ++i)
      r = boost::math::hypot(r, a[i]);
    if (r <= radius) return a;
    double scaling_factor = radius / r;
    point_type p;
    for (std::size_t i = 0; i < Dims; ++i)
      p[i] = a[i] * scaling_factor;
    return p;
  }

  double distance_from_boundary(point_type a) const
  {
    double r = 0.;
    for (std::size_t i = 0; i < Dims                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       