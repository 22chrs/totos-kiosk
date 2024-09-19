

# REZEPT

#! 1. Order verwerten:

{
  "Order Details": {
    "automatenID": "Testumgebung",
    "whichTerminal": "front",
    "orderID": null,
    "orderStatus": "paymentReserved",
    "timeStampOrder": "20240918_124850",
    "totalPrice": 3.51,
    "tip": 0
  },
  "products": [
    {
      "productName": "Schwarzer Kaffee",
      "productCategory": "Kaffee",
      "calculatedPrice": 1,
      "vat": 0.19,
      "choosenSize": "200 ml",
      "choosenSugar": "zero",
      "choosenMug": "einwegVariable",
      "choosenLid": "ohneDeckel",
      "preparationStation": "ordered",
      "quantity": 1
    },
    {
      "productName": "Expresso",
      "productCategory": "Kaffee",
      "calculatedPrice": 2.51,
      "vat": 0.19,
      "choosenSize": "35 ml",
      "choosenSugar": "zero",
      "choosenMug": "einwegVariable",
      "choosenLid": "ohneDeckel",
      "preparationStation": "ordered",
      "quantity": 1
    }
  ],
  "payment": {
    "status": "",
    "receipt_number": "",
    "payment_style": "reservation",
    "date": "",
    "time": "",
    "amount_in_cents": "",
    "currency": "",
    "card_name": "",
    "payment_type": "",
    "card_id": "",
    "expiry_date": "",
    "terminal_id": "",
    "trace": ""
  }
}

#! 2. Rezept Loop für alle Prdukte der Kategorie Kaffee u Trinkschoki:
-> Falls Anzahl eines productName > 1 das Rezept 2 mal unteinander schreiben

# AskForCup(choosenMug, choosenSize)
# ProvideMug(choosenMug, choosenSize)
# MoveBecherschubse(LiftPosition)
# if choosenSugar != 'zero'
#       TotoMoveCupFromBecherkarusellToBecherschubse(choosenMug, choosenSize, whichTerminal)
#       MoveBecherschubse(SugarPosition, whichTerminal)
#       InsertSugar(choosenSugar, whichTerminal)
#       MoveBecherschubse(LiftPosition, whichTerminal)
#       TotoMoveCupFromBecherschubseToCoffeemachine(choosenMug, choosenSize, whichTerminal)
# if choosenSugar === 'zero'
#       TotoMoveCupFromBecherkarusellToCoffeemachine(choosenMug, choosenSize)
# prepareDrink(productName, choosenSize)
# TotoMoveCupFromCoffeemachineToBecherschubse(choosenMug, choosenSize, whichTerminal)
# if choosenLid === 'mitDeckel'
#       additinal logic .. // whichTerminal
# if choosenLid === 'ohneDeckel'
#       MoveBecherschubseAndCloseSchleuse(Ausgabepostion, whichTerminal)
# if SensorCheckAusgabefach(whichTerminal) === true
#    
# else
#       Show Error and say Entschuldiung(whichTerminal)
# OpenAusgabe

#  -> all Ausgaben Done: ConfirmPaymentBooking(Receipt ID and Timestamp)

#! 2. Rezept Loop für alle Prdukte der Kategorie Snacks: