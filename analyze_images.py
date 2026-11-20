import os
import cv2
import numpy as np
import json

img_dir = r'c:\client websites\project details\Craftvale\websites\website_4\extracted_images'
files = [f for f in os.listdir(img_dir) if f.endswith(('.jpeg', '.jpg', '.png')) and not f.startswith('catalog')]

records = []
for f in files:
    p = os.path.join(img_dir, f)
    img = cv2.imread(p)
    if img is None:
        continue
    h, w = img.shape[:2]
    if w < 120 or h < 120:
        continue
    
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h_channel, s_channel, v_channel = cv2.split(hsv)
    
    mean_sat = float(np.mean(s_channel))
    mean_val = float(np.mean(v_channel))
    mean_hue = float(np.mean(h_channel))
    
    white_mask = (s_channel < 40) & (v_channel > 200)
    white_ratio = float(np.sum(white_mask) / (w * h))
    
    skin_mask = ((h_channel < 25) | (h_channel > 165)) & (s_channel > 40) & (s_channel < 210) & (v_channel > 70)
    skin_ratio = float(np.sum(skin_mask) / (w * h))
    
    blue_teal_mask = (h_channel >= 80) & (h_channel <= 130) & (s_channel > 50)
    blue_ratio = float(np.sum(blue_teal_mask) / (w * h))
    
    records.append({
        'file': f,
        'w': w,
        'h': h,
        'aspect': round(w/h, 2),
        'size_kb': round(os.path.getsize(p)/1024, 1),
        'skin': round(skin_ratio, 3),
        'blue': round(blue_ratio, 3),
        'white': round(white_ratio, 3),
        'val': round(mean_val, 1)
    })

print(f'Total candidates analyzed: {len(records)}')

smiles_doctor = [r for r in records if r['skin'] > 0.20]
clinic_interior = [r for r in records if r not in smiles_doctor and (r['blue'] > 0.08 or (r['white'] > 0.25 and r['val'] > 140))]
others = [r for r in records if r not in smiles_doctor and r not in clinic_interior]

print(f'Cluster 1 (Dentist / Patient / Smile / Clinical Treatment): {len(smiles_doctor)}')
for x in smiles_doctor[:15]:
    print(f"  {x['file']}: {x['w']}x{x['h']}, skin={x['skin']}, blue={x['blue']}, white={x['white']}")

print(f'\nCluster 2 (Clinic Interior / Operatory / Dental Chair / Facility): {len(clinic_interior)}')
for x in clinic_interior[:15]:
    print(f"  {x['file']}: {x['w']}x{x['h']}, blue={x['blue']}, white={x['white']}")

print(f'\nCluster 3 (Equipment / Exterior / Signboard / Certificates / Additional): {len(others)}')
for x in others[:15]:
    print(f"  {x['file']}: {x['w']}x{x['h']}, blue={x['blue']}, white={x['white']}, val={x['val']}")

# Save report
out_data = {
    'smiles_doctor': smiles_doctor,
    'clinic_interior': clinic_interior,
    'others': others
}
with open(os.path.join(img_dir, 'clusters.json'), 'w', encoding='utf-8') as fp:
    json.dump(out_data, fp, indent=2)

print('Saved clusters.json')
