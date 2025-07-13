import joblib

model = joblib.load("global_model/oneclass_svm.pkl")
scaler = joblib.load("global_model/scaler.pkl")

sample = [
   0.1491, 0.3979, 0.2488, 0.1069, 0.1674, 0.0015, 0.1169, 0.2212, 0.1043, 0.1417, 1.1885, 1.0468, 0.146, 1.6055, 1.4909, 0.1067, 0.759, 0.6523, 0.1016, 0.2136, 0.112, 0.1349, 0.1484, 0.0135, 0.0932, 0.3515, 0.2583, 0.1338, 0.3509, 0.2171, 0.0742

]

X = scaler.transform([sample])
pred = model.predict(X)[0]
score = model.decision_function(X)[0]

if pred == 1 and score > 0.6:
    result = "Valid login"
elif pred == 1:
    result = " Suspicious login"
else:
    result = "Threat detected"

print(f"{result} | Score: {score:.4f}")
