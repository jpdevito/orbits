# Orbits
I’ve always found orbital mechanics fascinating, so I made this fun and simple orbital mechanics simulator. The code is hosted at [this GitHub Pages site](https://jpdevito.github.io/orbits/).

While the size of the planets and their distances from the sun are clearly unrealistic, I used formulas derived from Newton’s laws of gravitation to calculate the speed at which the planets orbit, and the motion of the rockets. The planets only experience gravity from the sun, not from each other, or else the solar system would not work on this scale.

The units I used with the formulas are pixels for distance, updates (when the graphics refresh) for time, and “pixelmass” (square pixels) to measure mass. Because I am treating every pixel as if it has the same mass, the relative masses of the planets and sun are not accurate.

### Control Panel
There is a control panel on the bottom left of the page that allows you to change some parameters, this is what they each are:

***Gravitational Constant***  
The universal constant “G” which affects the speed at which the planets revolve around the sun (so they stay in orbit) and how strongly the rockets are pulled to the sun/planets.
Units: pixels^3 * pixelmass^(-1) * updates^(-2)

***Launch Velocity***  
The speed that the rockets start at.
Units: pixels per update

***Gravity From Planets***  
If checked, the rockets experience gravitational effects from the planets and sun, otherwise only from the sun.

***Collisions***  
If checked, rockets disappear after colliding with a planet or the sun.

***Planets & Sun Scale***  
Changes the size of the sun and planets; does not change mass.
