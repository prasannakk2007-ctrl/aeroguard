import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

csv_path = os.path.join(os.path.dirname(__file__), 'aeroguard.csv')

if os.path.exists(csv_path):
    print(f"Loading Kaggle dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Select only numeric columns
    numeric_df = df.select_dtypes(include=[np.number])
    print("Numeric columns found:", numeric_df.columns.tolist())
    
    # Specific Kaggle weather columns mapping
    cols_to_use = []
    for c in numeric_df.columns:
        c_lower = c.lower()
        if any(k in c_lower for k in ['temp', 'wind', 'visib', 'press', 'baro', 'humidity']):
            cols_to_use.append(c)
    
    # Pick top 4 numeric weather features
    if len(cols_to_use) >= 4:
        selected_cols = cols_to_use[:4]
    else:
        selected_cols = numeric_df.columns[:4].tolist()
        
    print(f"Selected features for Isolation Forest: {selected_cols}")
    X_train = numeric_df[selected_cols].dropna().values

else:
    print("Kaggle aeroguard.csv not found in backend folder. Generating synthetic dataset...")
    np.random.seed(42)
    normal = np.column_stack((
        np.random.normal(loc=25.0, scale=4.0, size=900),
        np.random.normal(loc=12.0, scale=3.0, size=900),
        np.random.normal(loc=9.5, scale=0.8, size=900),
        np.random.normal(loc=1013.25, scale=4.0, size=900)
    ))
    anomalies = np.column_stack((
        np.random.uniform(low=-5.0, high=45.0, size=100),
        np.random.uniform(low=28.0, high=55.0, size=100),
        np.random.uniform(low=0.1, high=2.5, size=100),
        np.random.uniform(low=970.0, high=1040.0, size=100)
    ))
    X_train = np.vstack((normal, anomalies))

# Train Unsupervised Isolation Forest Model
print(f"Training Isolation Forest model on {len(X_train)} samples...")
model = IsolationForest(
    n_estimators=100,
    contamination=0.10,
    random_state=42
)
model.fit(X_train)

# Save serialized model object
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
joblib.dump(model, model_path)
print(f"Successfully trained Isolation Forest ML Model and saved as '{model_path}'!")