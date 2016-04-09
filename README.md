# INTRODUCTION

This (still) unnamed project will be a webpage in which football's live info will 
be displayed. It will work in a similar way as other pages such as FlashScores.co.uk.
Of course, this kind of services require plenty of employees and work to have the
latest data. That's why only Swedish football league's results and info will be
shown on the page for this project.

Nevertheless, the design will be such that allows easy administration and creation
of new data. This is, new leagues, teams, matches... can be added when needed,
without no other change in the design.

## Functional Specification

The webpage's homepage will display all leagues that are available to check in
the site, with all the matches that will be played that week.

Clicking in each of the matches will lead to another page with information about
that game, the playing teams, their squads, ranking of the league and info of that
kind.

Clicking in one team will lead to a page that shows that team's information, such
as current players, track record, and so on.

The back-end (administration site) of the webpage must be easy to use. This means
that no technique (Like accessing the database) knowledge will be required to use
it.

The design (of the database) must be such that will allow different information
of many players, many teams, many leagues and many seasons to be stored without
any further changes to this design.

## Non-functional specification

I personally don't know how to use any of the server-side frameworks mentioned
in the requirements. But after making a bit of research, I've chosen Angular,
because of all of the others, Angular seems the one that is being worked the most
on.

Express.js will be the server-side framework. I've seen that it works in a similar
way as Flask (routing, static pages...) but I have already worked with Flask and
want to try something else, but not too different either.

For deployment, I'm using a localhost copy for development and a working copy that
is going to be pushed to a server in Heroku.