from dataclasses import dataclass
from typing import List, Dict, Union
from flask import Flask, request, jsonify, abort # type: ignore
import re


# ==== Type DefrecipeNameions, feel free to add or modify ===========================
@dataclass
class CookbookEntry:
   name: str


@dataclass
class RequiredItem():
   name: str
   quantity: int


@dataclass
class Recipe(CookbookEntry):
   required_items: List[RequiredItem]


@dataclass
class Ingredient(CookbookEntry):
   cook_time: int






# =============================================================================
# ==== HTTP Endpoint Stubs ====================================================
# =============================================================================
app = Flask(__name__)


# Store your recipes here!
cookbook = {
   "recipes": {},
   "ingredients": {}
}


# Task 1 helper (don't touch)
@app.route("/parse", methods=['POST'])
def parse():
   data = request.get_json()
   recipe_name = data.get('input', '')
   parsed_name = parse_handwriting(recipe_name)
   if parsed_name is None:
       return 'Invalid recipe name', 400
   return jsonify({'msg': parsed_name}), 200


# [TASK 1] ====================================================================
# Takes in a recipeName and returns it in a form that
def parse_handwriting(recipeName: str) -> Union[str | None]:
   # This is the code I recipeNameially wrote, but after researching online, I found some wayyyyy more efficient functions/methods I could have used
   # recipe = recipeName.lower()
   # reset = True
   # recipeName = ""
   # for i in range(len(recipe)):
   #   if reset == True and recipe[i].isalpha():
   #       recipeName += recipe[i].upper()
   #       reset = False
   #       continue
   #   if recipe[i] == "-" or recipe[i] == "_" or recipe[i] == " ":
   #       recipeName += " "
   #       reset =  True
   #   if recipe[i].isalpha():
   #       recipeName += recipe[i]
   # finalString = ""
   # lastChar = ''
   # for j in range(len(recipeName)):
   #   if lastChar == " " and recipeName[j] == " ":
   #       continue
   #   finalString += recipeName[j]
   #   lastChar = recipeName[j]
   # if len(finalString) == 0:
   #   return None
   # if finalString[-1] == " ":
   #   return finalString[:-1]
   # return finalString


   # So this function I found online and it literally just replaces all - and _ with whitespace, or whatever I put in those second quotes
   recipeName = re.sub(r"[-_]+", " ", recipeName)
   # Removes trailing/leading whitespace
   recipeName = recipeName.strip()
   # Removes extra whitespace inbetween words by splitting into an array
   recipeName = recipeName.split()
   # Rejoins string by concatenating the array with whatever I put in the quotes
   recipeName = " ".join(recipeName)
   # Gets rid of all non-alphabetical characters
   recipeName = recipeName.lower()
   init = ""
   for character in recipeName:
       if character.isalpha() or character == " ":
           init += character
          
   if len(init) == 0:
       return None
   # Method to title each word
   init = init.title()
   return init




# [TASK 2] ====================================================================
# Endpoint that adds a CookbookEntry to your magical cookbook
@app.route('/entry', methods=['POST'])
def create_entry():
   # TODO: implement me
   data = request.get_json()
   type = data.get('type')
   name = data.get('name')


   if name in cookbook['recipes'] or name in cookbook['ingredients']:
       return '', 400
   if type == "ingredient":
       cookTime = data.get('cookTime')
       if cookTime < 0:
           return 'invalid cook time', 400
       cookbook['ingredients'][name] = {
           "type": type,
           "name": name,
           "cookTime": cookTime
       }
   elif type == "recipe":
       requiredItems = data.get('requiredItems')
       itemCheck = []
       for item in requiredItems:
           itemName = item.get('name')
           if itemName in itemCheck:
               return 'duplicate items', 400
           else:
               itemCheck.append(itemName)
           if item.get('quantity') <= 0:
               return 'invalid quantity', 400
       cookbook['recipes'][name] = {
           "type": type,
           "name": name,
           "requiredItems": requiredItems
       }
   else:
       return 'wrong type', 400
   return '', 200




# [TASK 3] ====================================================================
# Endpoint that returns a summary of a recipe that corresponds to a query name
@app.route('/summary', methods=['GET'])
def summary():
   # TODO: implement me
   name = request.args.get('name')
   if name in cookbook['recipes']:
       item = cookbook['recipes'][name]
   else:
       return 'item not found or is ingredient', 400
   summary = ingredientFetcher(item)
   final = {
       "name": summary.get('name'),
       "cookTime": summary.get('cookTime'),
       "ingredients": []
   }
   final["ingredients"] = list(summary["ingredients"].values())
   return final, 200
  


def ingredientFetcher(final: dict) -> dict:
   requiredItems = final.get('requiredItems')
   # Initialise summary
   summary = {
       "name": final.get('name'),
       "cookTime": 0,
       "ingredients": {}
   }
   for item in requiredItems:
       itemName = item.get('name')
       # Find the food in the cookbook
       food = cookbook["ingredients"].get(itemName) or cookbook["recipes"].get(itemName)
       if food:
           # Look for the food in the cookbook, and if it is an ingredient, add it to the summary
           if food.get('type') == 'ingredient':
               ingredientSummary(summary, itemName, item, food)
           # If the food is a recipe, add to summary
           else:
               recSummary(summary, item, food)
       # If the food cannot be found
       else:
           abort(400)
   return summary


def ingredientSummary(summary: dict, itemName: str, item: dict, food: dict) -> dict:
   if itemName in summary['ingredients']:
       summary['ingredients'][itemName]['quantity'] += item.get('quantity')
   else:
       summary['ingredients'][itemName] = item
  
   summary['cookTime'] += food.get('cookTime') * item.get('quantity')


def recSummary(summary: dict, item: dict, food: dict) -> dict:
   # Get the summary for that recipe
   recipeSummary = ingredientFetcher(food)
   # For each ingredient in the inner recipe summary, check if it already exists in our current summary
   for ingredientName, ingredient in recipeSummary['ingredients'].items():
       nice = False
       if ingredientName in summary['ingredients']:
           summary['ingredients'][ingredientName]['quantity'] += ingredient.get('quantity') * item.get('quantity')
       else:
           ingredient['quantity'] *= item.get('quantity')
           summary['ingredients'][ingredientName] = ingredient
      
   summary['cookTime'] += recipeSummary['cookTime'] * item.get('quantity')
  
# =============================================================================
# ==== DO NOT TOUCH ===========================================================
# =============================================================================


if __name__ == '__main__':
   app.run(debug=True, port=8080)


