# JustifyApi
# Introduction
REST API justify a text passed in parametre
# Overview
Things that the developers should know about

# Authentication
the api justify is secured using JWT token 
$host/api/token:POST return a valid token for the authenticated user
use the token to justify the text with $host/api/justify:POST 
max word for user is 80000
# Error Codes
400 for bad request 
402 for paiement requirement 
401 for unauthorized request
# post 
https://myjustifyapi.herokuapp.com/api/token
https://myjustifyapi.herokuapp.com/api/justify