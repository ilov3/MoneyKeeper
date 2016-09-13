# MoneyKeeper

This is simple financial web application which will help you track your 
expenses and incomes. It allows to create different accounts (credit card, cash, etc)
and categories.

## Getting started

1) Clone the repository and `cd` into the project folder

2) `pip install -r requirements.txt`

3) If you don't have nodejs and npm install them first. After this run:
`npm install -g bower gulp && npm install`

4) Database and other valuable settings are stored within envdir folder,
there is example so you can simply copy it with `cp envdir.example envdir` 
and change values to fit your environment

5) Run dev server using: `python manage.py runserver`