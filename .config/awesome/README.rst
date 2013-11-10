PwrSolr: Awesome Powerarrow theme with Solarized colors
---------

The following modification to the original theme were made:

* colors were changed to use (mostly) dark version of Solarized colors
* the huge menu was trimmed dramatically to only include basic stuff
* the bottom ``wibox`` panel was added that includes only "status" widgets
* ``net`` widget was changed to use ``wlan0`` interface -- I am using this on a laptop!
* menu hieght was increased to 24px to increase readability and to accomodate AwOken (link!) icons
* widget icons were re-drawn. .svn files are included. Ditto for layout icons.
* ``cpu`` and ``sensors`` widgets were updated for a 4-core i7-based system. Change accordingly for your needs.
* icons were reorganized and put in several directories for easier access

Future plans
---------

* make dynamic widgets for wireless and battery that change the icon depending on the signal strength or the charge level

Installation
---------
To install the theme, copy the content of the top-level directory to yourconfiguration directory, i.e. ``/home/<user>/.config/awesome``

Screenshot (clean)
---------
.. image:: https://raw.github.com/eco32i/pwrsolr/master/screenshots/pwrsolr-clean.png

