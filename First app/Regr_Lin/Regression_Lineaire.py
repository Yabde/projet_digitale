import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

#Initialise Data as lists
data = {'Colonne 1' : [0,1,5,2,3,10,11,4,5,7],
         'Colonne 2' : [8,8,6,10,5,9,7,8,5,9],
         'Colonne 3' : [100,348,286,493,234,493,719,1000,213,800]}

#Create Dataframe
data_final = pd.DataFrame(data)

#Print data_final  (juste pour voir)
print(data_final)

#Ici on va PREDIRE la dernière colonne => Donc on coupe le tableau en deux : X && Y
X = data_final.iloc[:, :2]
y = data_final.iloc[:, -1]   #dernière colonne

#Model = Simple Regression Linéaire

regression = LinearRegression()
regression.fit(X, y)

#Sauvegarde pour le réutiliser dans l'API  (nécessaire ???)
pickle.dump(regression, open('.\\Regr_Lin\\model.pkl','wb'))
model = pickle.load(open('.\\Regr_Lin\\model.pkl','rb'))

#Petit test
print(model.predict([[2, 9]]))