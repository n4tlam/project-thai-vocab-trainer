import { useState, useEffect, useRef } from "react";

/* ── FONTS & GLOBAL STYLES ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --ink:       #1a1209;
      --paper:     #f5efe3;
      --aged:      #e8dcc8;
      --gold:      #c8922a;
      --gold-lt:   #e8b84b;
      --jade:      #2e7d5e;
      --jade-lt:   #3da876;
      --vermilion: #c0392b;
      --muted:     #8a7a62;
      --shadow:    rgba(26,18,9,0.10);
    }
    html { -webkit-text-size-adjust: 100%; }
    body {
      background: var(--paper);
      font-family: 'DM Sans', sans-serif;
      -webkit-tap-highlight-color: transparent;
      overscroll-behavior: none;
    }
    button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    input  { -webkit-tap-highlight-color: transparent; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);    opacity: 0.7; }
      70%  { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(1.35); opacity: 0; }
    }
    .screen-enter { animation: fadeUp 0.3s ease both; }
    .pulse-ring { position: relative; }
    .pulse-ring::before {
      content: '';
      position: absolute; inset: -8px;
      border-radius: 50%;
      border: 3px solid var(--jade);
      animation: pulse-ring 1.4s ease-out infinite;
      pointer-events: none;
    }
    /* prevent iOS bounce on body but allow scroll inside containers */
    .scrollable { overflow-y: auto; -webkit-overflow-scrolling: touch; }
  `}</style>
);

/* ── VOCABULARY DATA ── */
const ALL_VOCAB = [
  { category: "Fundamentals", thai: "สวัสดี", en: "hello / greetings" },
  { category: "Fundamentals", thai: "ขอบคุณ", en: "thank you" },
  { category: "Fundamentals", thai: "ขอโทษ", en: "sorry / excuse me" },
  { category: "Fundamentals", thai: "ใช่", en: "yes" },
  { category: "Fundamentals", thai: "ไม่", en: "no / not" },
  { category: "Fundamentals", thai: "ฉัน", en: "I / me (female)" },
  { category: "Fundamentals", thai: "ผม", en: "I / me (male)" },
  { category: "Fundamentals", thai: "คุณ", en: "you" },
  { category: "Fundamentals", thai: "เขา", en: "he / she / they" },
  { category: "Fundamentals", thai: "เรา", en: "we / us" },
  { category: "Fundamentals", thai: "พวกเขา", en: "they / them" },
  { category: "Fundamentals", thai: "นี่", en: "this" },
  { category: "Fundamentals", thai: "นั่น", en: "that" },
  { category: "Fundamentals", thai: "ที่นี่", en: "here" },
  { category: "Fundamentals", thai: "ที่นั่น", en: "there" },
  { category: "Fundamentals", thai: "อะไร", en: "what" },
  { category: "Fundamentals", thai: "ใคร", en: "who" },
  { category: "Fundamentals", thai: "ที่ไหน", en: "where" },
  { category: "Fundamentals", thai: "เมื่อไร", en: "when" },
  { category: "Fundamentals", thai: "ทำไม", en: "why" },
  { category: "Fundamentals", thai: "อย่างไร", en: "how" },
  { category: "Fundamentals", thai: "เท่าไร", en: "how much / how many" },
  { category: "Fundamentals", thai: "และ", en: "and" },
  { category: "Fundamentals", thai: "หรือ", en: "or" },
  { category: "Fundamentals", thai: "แต่", en: "but" },
  { category: "Fundamentals", thai: "เพราะ", en: "because" },
  { category: "Fundamentals", thai: "ถ้า", en: "if" },
  { category: "Fundamentals", thai: "ดังนั้น", en: "so / therefore" },
  { category: "Fundamentals", thai: "มาก", en: "very / a lot" },
  { category: "Fundamentals", thai: "นิดหน่อย", en: "a little" },
  { category: "Fundamentals", thai: "ทุก", en: "every / all" },
  { category: "Fundamentals", thai: "บางส่วน", en: "some" },
  { category: "Fundamentals", thai: "ไม่มี", en: "none / there is no" },
  { category: "Fundamentals", thai: "มี", en: "there is / to have" },
  { category: "Fundamentals", thai: "ต้องการ", en: "to want / to need" },
  { category: "Fundamentals", thai: "รู้", en: "to know" },
  { category: "Fundamentals", thai: "คิด", en: "to think" },
  { category: "Fundamentals", thai: "เชื่อ", en: "to believe" },
  { category: "Fundamentals", thai: "เข้าใจ", en: "to understand" },
  { category: "Fundamentals", thai: "พูด", en: "to speak / to say" },
  { category: "Fundamentals", thai: "ถาม", en: "to ask" },
  { category: "Fundamentals", thai: "ตอบ", en: "to answer" },
  { category: "Fundamentals", thai: "ดี", en: "good" },
  { category: "Fundamentals", thai: "ไม่ดี", en: "bad / not good" },
  { category: "Fundamentals", thai: "สวย", en: "beautiful / pretty" },
  { category: "Fundamentals", thai: "ใหญ่", en: "big / large" },
  { category: "Fundamentals", thai: "เล็ก", en: "small / little" },
  { category: "Fundamentals", thai: "เร็ว", en: "fast / quick" },
  { category: "Fundamentals", thai: "ช้า", en: "slow" },
  { category: "Fundamentals", thai: "ง่าย", en: "easy" },
  { category: "Fundamentals", thai: "ยาก", en: "difficult / hard" },
  { category: "Fundamentals", thai: "ถูก", en: "cheap / correct" },
  { category: "Fundamentals", thai: "แพง", en: "expensive" },
  { category: "Fundamentals", thai: "ใหม่", en: "new" },
  { category: "Fundamentals", thai: "เก่า", en: "old" },
  { category: "Fundamentals", thai: "ร้อน", en: "hot" },
  { category: "Fundamentals", thai: "เย็น", en: "cold / cool" },
  { category: "Fundamentals", thai: "หิว", en: "hungry" },
  { category: "Fundamentals", thai: "อิ่ม", en: "full (after eating)" },
  { category: "Fundamentals", thai: "เหนื่อย", en: "tired" },
  { category: "Fundamentals", thai: "ง่วง", en: "sleepy" },
  { category: "Fundamentals", thai: "เจ็บ", en: "hurt / to be in pain" },
  { category: "Fundamentals", thai: "ป่วย", en: "sick / ill" },
  { category: "Fundamentals", thai: "สบายดี", en: "to be well / fine" },
  { category: "Fundamentals", thai: "ยินดี", en: "glad / pleased" },
  { category: "Fundamentals", thai: "เศร้า", en: "sad" },
  { category: "Fundamentals", thai: "กลัว", en: "scared / afraid" },
  { category: "Fundamentals", thai: "โกรธ", en: "angry" },
  { category: "Fundamentals", thai: "ตื่นเต้น", en: "excited" },
  { category: "Fundamentals", thai: "วัน", en: "day" },
  { category: "Fundamentals", thai: "คืน", en: "night" },
  { category: "Fundamentals", thai: "สัปดาห์", en: "week" },
  { category: "Fundamentals", thai: "เดือน", en: "month" },
  { category: "Fundamentals", thai: "ปี", en: "year" },
  { category: "Fundamentals", thai: "เวลา", en: "time" },
  { category: "Fundamentals", thai: "ตอนนี้", en: "now" },
  { category: "Fundamentals", thai: "แล้ว", en: "already / then" },
  { category: "Fundamentals", thai: "ยัง", en: "still / yet" },
  { category: "Fundamentals", thai: "เดี๋ยว", en: "in a moment / soon" },
  { category: "Fundamentals", thai: "บ้าน", en: "house / home" },
  { category: "Fundamentals", thai: "โรงเรียน", en: "school" },
  { category: "Fundamentals", thai: "งาน", en: "work / job" },
  { category: "Fundamentals", thai: "เงิน", en: "money" },
  { category: "Fundamentals", thai: "คน", en: "person / people" },
  { category: "Fundamentals", thai: "เพื่อน", en: "friend" },
  { category: "Fundamentals", thai: "ครอบครัว", en: "family" },
  { category: "Fundamentals", thai: "พ่อ", en: "father" },
  { category: "Fundamentals", thai: "แม่", en: "mother" },
  { category: "Fundamentals", thai: "พี่", en: "older sibling" },
  { category: "Fundamentals", thai: "น้อง", en: "younger sibling" },
  { category: "Fundamentals", thai: "ลูก", en: "child / children" },
  { category: "Fundamentals", thai: "สามี", en: "husband" },
  { category: "Fundamentals", thai: "ภรรยา", en: "wife" },
  { category: "Fundamentals", thai: "ชื่อ", en: "name" },
  { category: "Fundamentals", thai: "อายุ", en: "age" },
  { category: "Fundamentals", thai: "ประเทศ", en: "country" },
  { category: "Fundamentals", thai: "ภาษา", en: "language" },
  { category: "Fundamentals", thai: "หนังสือ", en: "book" },
  { category: "Fundamentals", thai: "ตัวเลข", en: "number" },
  { category: "Fundamentals", thai: "สี", en: "colour" },
  { category: "Food & Drink", thai: "ข้าว", en: "rice" },
  { category: "Food & Drink", thai: "ข้าวเหนียว", en: "sticky rice" },
  { category: "Food & Drink", thai: "ก๋วยเตี๋ยว", en: "noodle soup" },
  { category: "Food & Drink", thai: "ผัดไทย", en: "pad Thai" },
  { category: "Food & Drink", thai: "ต้มยำ", en: "tom yum (spicy soup)" },
  { category: "Food & Drink", thai: "ต้มข่า", en: "tom kha (coconut soup)" },
  { category: "Food & Drink", thai: "แกงเขียวหวาน", en: "green curry" },
  { category: "Food & Drink", thai: "แกงแดง", en: "red curry" },
  { category: "Food & Drink", thai: "แกงมัสมั่น", en: "massaman curry" },
  { category: "Food & Drink", thai: "ข้าวผัด", en: "fried rice" },
  { category: "Food & Drink", thai: "ผัดกะเพรา", en: "stir-fried basil" },
  { category: "Food & Drink", thai: "ผัดซีอิ๊ว", en: "stir-fried noodles with soy sauce" },
  { category: "Food & Drink", thai: "ส้มตำ", en: "papaya salad" },
  { category: "Food & Drink", thai: "ลาบ", en: "minced meat salad (larb)" },
  { category: "Food & Drink", thai: "ยำ", en: "Thai salad / spicy salad" },
  { category: "Food & Drink", thai: "ไข่", en: "egg" },
  { category: "Food & Drink", thai: "ไข่ดาว", en: "fried egg (sunny side up)" },
  { category: "Food & Drink", thai: "ไข่เจียว", en: "Thai omelette" },
  { category: "Food & Drink", thai: "ไก่", en: "chicken" },
  { category: "Food & Drink", thai: "หมู", en: "pork" },
  { category: "Food & Drink", thai: "เนื้อ", en: "beef / meat" },
  { category: "Food & Drink", thai: "กุ้ง", en: "shrimp / prawn" },
  { category: "Food & Drink", thai: "ปลา", en: "fish" },
  { category: "Food & Drink", thai: "ปู", en: "crab" },
  { category: "Food & Drink", thai: "หอย", en: "shellfish / clam" },
  { category: "Food & Drink", thai: "เต้าหู้", en: "tofu" },
  { category: "Food & Drink", thai: "ผัก", en: "vegetables" },
  { category: "Food & Drink", thai: "ผลไม้", en: "fruit" },
  { category: "Food & Drink", thai: "มะม่วง", en: "mango" },
  { category: "Food & Drink", thai: "มะละกอ", en: "papaya" },
  { category: "Food & Drink", thai: "กล้วย", en: "banana" },
  { category: "Food & Drink", thai: "สับปะรด", en: "pineapple" },
  { category: "Food & Drink", thai: "ลำไย", en: "longan" },
  { category: "Food & Drink", thai: "ลิ้นจี่", en: "lychee" },
  { category: "Food & Drink", thai: "ทุเรียน", en: "durian" },
  { category: "Food & Drink", thai: "มังคุด", en: "mangosteen" },
  { category: "Food & Drink", thai: "ส้ม", en: "orange" },
  { category: "Food & Drink", thai: "แตงโม", en: "watermelon" },
  { category: "Food & Drink", thai: "น้ำ", en: "water" },
  { category: "Food & Drink", thai: "น้ำแข็ง", en: "ice" },
  { category: "Food & Drink", thai: "ชา", en: "tea" },
  { category: "Food & Drink", thai: "กาแฟ", en: "coffee" },
  { category: "Food & Drink", thai: "นม", en: "milk" },
  { category: "Food & Drink", thai: "น้ำผลไม้", en: "fruit juice" },
  { category: "Food & Drink", thai: "เบียร์", en: "beer" },
  { category: "Food & Drink", thai: "ไวน์", en: "wine" },
  { category: "Food & Drink", thai: "น้ำอัดลม", en: "soft drink / soda" },
  { category: "Food & Drink", thai: "น้ำมะพร้าว", en: "coconut water" },
  { category: "Food & Drink", thai: "สมูทตี้", en: "smoothie" },
  { category: "Food & Drink", thai: "เกลือ", en: "salt" },
  { category: "Food & Drink", thai: "น้ำตาล", en: "sugar" },
  { category: "Food & Drink", thai: "พริก", en: "chilli" },
  { category: "Food & Drink", thai: "กระเทียม", en: "garlic" },
  { category: "Food & Drink", thai: "หอมแดง", en: "shallot" },
  { category: "Food & Drink", thai: "ขิง", en: "ginger" },
  { category: "Food & Drink", thai: "ข่า", en: "galangal" },
  { category: "Food & Drink", thai: "ตะไคร้", en: "lemongrass" },
  { category: "Food & Drink", thai: "ใบกะเพรา", en: "holy basil" },
  { category: "Food & Drink", thai: "ใบมะกรูด", en: "kaffir lime leaf" },
  { category: "Food & Drink", thai: "น้ำปลา", en: "fish sauce" },
  { category: "Food & Drink", thai: "ซีอิ๊วขาว", en: "light soy sauce" },
  { category: "Food & Drink", thai: "น้ำมะนาว", en: "lime juice" },
  { category: "Food & Drink", thai: "มะนาว", en: "lime" },
  { category: "Food & Drink", thai: "ขนม", en: "dessert / snack" },
  { category: "Food & Drink", thai: "ขนมปัง", en: "bread" },
  { category: "Food & Drink", thai: "เค้ก", en: "cake" },
  { category: "Food & Drink", thai: "ไอศกรีม", en: "ice cream" },
  { category: "Food & Drink", thai: "โจ๊ก", en: "rice congee / porridge" },
  { category: "Food & Drink", thai: "บะหมี่", en: "egg noodles" },
  { category: "Food & Drink", thai: "เส้นก๋วยเตี๋ยว", en: "rice noodles" },
  { category: "Food & Drink", thai: "หมูกระทะ", en: "Thai BBQ hotpot" },
  { category: "Food & Drink", thai: "สะเต๊ะ", en: "satay" },
  { category: "Food & Drink", thai: "ปอเปี๊ยะ", en: "spring rolls" },
  { category: "Food & Drink", thai: "ทอดมัน", en: "fish cakes" },
  { category: "Food & Drink", thai: "ข้าวมันไก่", en: "Hainanese chicken rice" },
  { category: "Food & Drink", thai: "ข้าวหมูแดง", en: "red pork rice" },
  { category: "Food & Drink", thai: "ราดหน้า", en: "noodles with thick gravy" },
  { category: "Food & Drink", thai: "เมนู", en: "menu" },
  { category: "Food & Drink", thai: "ร้านอาหาร", en: "restaurant" },
  { category: "Food & Drink", thai: "ครัว", en: "kitchen" },
  { category: "Food & Drink", thai: "จาน", en: "plate" },
  { category: "Food & Drink", thai: "ชาม", en: "bowl" },
  { category: "Food & Drink", thai: "ช้อน", en: "spoon" },
  { category: "Food & Drink", thai: "ส้อม", en: "fork" },
  { category: "Food & Drink", thai: "ตะเกียบ", en: "chopsticks" },
  { category: "Food & Drink", thai: "แก้ว", en: "glass / cup" },
  { category: "Food & Drink", thai: "ขวด", en: "bottle" },
  { category: "Food & Drink", thai: "อร่อย", en: "delicious" },
  { category: "Food & Drink", thai: "เผ็ด", en: "spicy" },
  { category: "Food & Drink", thai: "หวาน", en: "sweet" },
  { category: "Food & Drink", thai: "เปรี้ยว", en: "sour" },
  { category: "Food & Drink", thai: "เค็ม", en: "salty" },
  { category: "Food & Drink", thai: "ขม", en: "bitter" },
  { category: "Food & Drink", thai: "มัน", en: "rich / oily / fatty" },
  { category: "Food & Drink", thai: "กรุบกรอบ", en: "crunchy / crispy" },
  { category: "Food & Drink", thai: "นุ่ม", en: "soft / tender" },
  { category: "Food & Drink", thai: "สด", en: "fresh" },
  { category: "Food & Drink", thai: "แช่แข็ง", en: "frozen" },
  { category: "Food & Drink", thai: "ปิ้ง", en: "grilled / toasted" },
  { category: "Food & Drink", thai: "หมัก", en: "marinated / fermented" },
  { category: "Travelling", thai: "สนามบิน", en: "airport" },
  { category: "Travelling", thai: "เครื่องบิน", en: "aeroplane" },
  { category: "Travelling", thai: "ตั๋ว", en: "ticket" },
  { category: "Travelling", thai: "หนังสือเดินทาง", en: "passport" },
  { category: "Travelling", thai: "วีซ่า", en: "visa" },
  { category: "Travelling", thai: "กระเป๋าเดินทาง", en: "suitcase / luggage" },
  { category: "Travelling", thai: "กระเป๋าสะพาย", en: "backpack" },
  { category: "Travelling", thai: "โรงแรม", en: "hotel" },
  { category: "Travelling", thai: "โฮสเทล", en: "hostel" },
  { category: "Travelling", thai: "ห้องพัก", en: "room (hotel)" },
  { category: "Travelling", thai: "การจอง", en: "reservation / booking" },
  { category: "Travelling", thai: "เช็คอิน", en: "check in" },
  { category: "Travelling", thai: "เช็คเอาท์", en: "check out" },
  { category: "Travelling", thai: "แผนที่", en: "map" },
  { category: "Travelling", thai: "ทิศทาง", en: "direction" },
  { category: "Travelling", thai: "เหนือ", en: "north" },
  { category: "Travelling", thai: "ใต้", en: "south" },
  { category: "Travelling", thai: "ตะวันออก", en: "east" },
  { category: "Travelling", thai: "ตะวันตก", en: "west" },
  { category: "Travelling", thai: "ซ้าย", en: "left" },
  { category: "Travelling", thai: "ขวา", en: "right" },
  { category: "Travelling", thai: "ตรงไป", en: "straight ahead" },
  { category: "Travelling", thai: "เลี้ยว", en: "to turn" },
  { category: "Travelling", thai: "ใกล้", en: "near / close" },
  { category: "Travelling", thai: "ไกล", en: "far" },
  { category: "Travelling", thai: "รถแท็กซี่", en: "taxi" },
  { category: "Travelling", thai: "รถตุ๊กตุ๊ก", en: "tuk-tuk" },
  { category: "Travelling", thai: "รถบัส", en: "bus" },
  { category: "Travelling", thai: "รถไฟ", en: "train" },
  { category: "Travelling", thai: "รถไฟฟ้า", en: "BTS Skytrain / elevated rail" },
  { category: "Travelling", thai: "รถไฟใต้ดิน", en: "MRT / underground / metro" },
  { category: "Travelling", thai: "เรือ", en: "boat" },
  { category: "Travelling", thai: "จักรยาน", en: "bicycle" },
  { category: "Travelling", thai: "มอเตอร์ไซค์", en: "motorbike" },
  { category: "Travelling", thai: "รถยนต์", en: "car" },
  { category: "Travelling", thai: "สถานี", en: "station" },
  { category: "Travelling", thai: "ป้ายรถเมล์", en: "bus stop" },
  { category: "Travelling", thai: "ท่าเรือ", en: "pier / dock" },
  { category: "Travelling", thai: "ถนน", en: "road / street" },
  { category: "Travelling", thai: "ซอย", en: "alley / side street" },
  { category: "Travelling", thai: "สะพาน", en: "bridge" },
  { category: "Travelling", thai: "แยก", en: "intersection" },
  { category: "Travelling", thai: "วงเวียน", en: "roundabout" },
  { category: "Travelling", thai: "ป้าย", en: "sign" },
  { category: "Travelling", thai: "ตลาด", en: "market" },
  { category: "Travelling", thai: "ห้างสรรพสินค้า", en: "shopping mall" },
  { category: "Travelling", thai: "วัด", en: "temple" },
  { category: "Travelling", thai: "พิพิธภัณฑ์", en: "museum" },
  { category: "Travelling", thai: "อุทยาน", en: "national park" },
  { category: "Travelling", thai: "ชายหาด", en: "beach" },
  { category: "Travelling", thai: "เกาะ", en: "island" },
  { category: "Travelling", thai: "น้ำตก", en: "waterfall" },
  { category: "Travelling", thai: "ภูเขา", en: "mountain" },
  { category: "Travelling", thai: "ทะเล", en: "sea / ocean" },
  { category: "Travelling", thai: "แม่น้ำ", en: "river" },
  { category: "Travelling", thai: "สระว่ายน้ำ", en: "swimming pool" },
  { category: "Travelling", thai: "ร้านแลกเงิน", en: "currency exchange" },
  { category: "Travelling", thai: "ธนาคาร", en: "bank" },
  { category: "Travelling", thai: "ตู้เอทีเอ็ม", en: "ATM" },
  { category: "Travelling", thai: "บาท", en: "baht (Thai currency)" },
  { category: "Travelling", thai: "ราคา", en: "price" },
  { category: "Travelling", thai: "ค่าโดยสาร", en: "fare" },
  { category: "Travelling", thai: "ฟรี", en: "free (of charge)" },
  { category: "Travelling", thai: "ห้องน้ำ", en: "toilet / bathroom" },
  { category: "Travelling", thai: "ทางออก", en: "exit" },
  { category: "Travelling", thai: "ทางเข้า", en: "entrance" },
  { category: "Travelling", thai: "ประตู", en: "door / gate" },
  { category: "Travelling", thai: "ลิฟต์", en: "lift / elevator" },
  { category: "Travelling", thai: "บันได", en: "stairs" },
  { category: "Travelling", thai: "ชั้น", en: "floor / level" },
  { category: "Travelling", thai: "ชั้นหนึ่ง", en: "first floor / ground floor" },
  { category: "Travelling", thai: "แอร์", en: "air conditioning" },
  { category: "Travelling", thai: "Wi-Fi", en: "Wi-Fi" },
  { category: "Travelling", thai: "ร้านสะดวกซื้อ", en: "convenience store" },
  { category: "Travelling", thai: "ซูเปอร์มาร์เก็ต", en: "supermarket" },
  { category: "Travelling", thai: "ไปรษณีย์", en: "post office" },
  { category: "Travelling", thai: "โรงพยาบาล", en: "hospital" },
  { category: "Travelling", thai: "ร้านขายยา", en: "pharmacy" },
  { category: "Travelling", thai: "ตำรวจ", en: "police" },
  { category: "Travelling", thai: "เหตุฉุกเฉิน", en: "emergency" },
  { category: "Travelling", thai: "ช่วยด้วย", en: "help! / please help" },
  { category: "Travelling", thai: "หลงทาง", en: "lost (direction)" },
  { category: "Travelling", thai: "สถานที่ท่องเที่ยว", en: "tourist attraction" },
  { category: "Travelling", thai: "นักท่องเที่ยว", en: "tourist" },
  { category: "Travelling", thai: "ไกด์", en: "tour guide" },
  { category: "Travelling", thai: "ทัวร์", en: "tour" },
  { category: "Travelling", thai: "เดินทาง", en: "to travel / journey" },
  { category: "Travelling", thai: "มาถึง", en: "to arrive" },
  { category: "Travelling", thai: "รหัสไปรษณีย์", en: "postcode / zip code" },
  { category: "Travelling", thai: "ที่อยู่", en: "address" },
  { category: "Travelling", thai: "เมือง", en: "city / town" },
  { category: "Travelling", thai: "จังหวัด", en: "province" },
  { category: "Travelling", thai: "ประตูขึ้นเครื่อง", en: "boarding gate" },
  { category: "Travelling", thai: "เที่ยวบิน", en: "flight" },
  { category: "Travelling", thai: "สัมภาระ", en: "baggage / luggage" },
  { category: "Travelling", thai: "ศุลกากร", en: "customs" },
  { category: "Travelling", thai: "ตรวจคนเข้าเมือง", en: "immigration" },
  { category: "Travelling", thai: "ออกเดินทาง", en: "to depart" },
  { category: "Travelling", thai: "กลับ", en: "to return / go back" },
  { category: "Describing Time", thai: "เช้า", en: "morning" },
  { category: "Describing Time", thai: "สาย", en: "late morning / mid-morning" },
  { category: "Describing Time", thai: "เที่ยง", en: "noon / midday" },
  { category: "Describing Time", thai: "บ่าย", en: "afternoon" },
  { category: "Describing Time", thai: "เย็น", en: "evening" },
  { category: "Describing Time", thai: "กลางคืน", en: "night" },
  { category: "Describing Time", thai: "เที่ยงคืน", en: "midnight" },
  { category: "Describing Time", thai: "ตีหนึ่ง", en: "1 AM" },
  { category: "Describing Time", thai: "ตีสอง", en: "2 AM" },
  { category: "Describing Time", thai: "ตีสาม", en: "3 AM" },
  { category: "Describing Time", thai: "ตีสี่", en: "4 AM" },
  { category: "Describing Time", thai: "ตีห้า", en: "5 AM" },
  { category: "Describing Time", thai: "หกโมงเช้า", en: "6 AM" },
  { category: "Describing Time", thai: "เจ็ดโมงเช้า", en: "7 AM" },
  { category: "Describing Time", thai: "แปดโมงเช้า", en: "8 AM" },
  { category: "Describing Time", thai: "เก้าโมงเช้า", en: "9 AM" },
  { category: "Describing Time", thai: "สิบโมงเช้า", en: "10 AM" },
  { category: "Describing Time", thai: "สิบเอ็ดโมงเช้า", en: "11 AM" },
  { category: "Describing Time", thai: "บ่ายโมง", en: "1 PM" },
  { category: "Describing Time", thai: "บ่ายสองโมง", en: "2 PM" },
  { category: "Describing Time", thai: "บ่ายสามโมง", en: "3 PM" },
  { category: "Describing Time", thai: "บ่ายสี่โมง", en: "4 PM" },
  { category: "Describing Time", thai: "บ่ายห้าโมง", en: "5 PM" },
  { category: "Describing Time", thai: "หกโมงเย็น", en: "6 PM" },
  { category: "Describing Time", thai: "ทุ่มหนึ่ง", en: "7 PM" },
  { category: "Describing Time", thai: "สองทุ่ม", en: "8 PM" },
  { category: "Describing Time", thai: "สามทุ่ม", en: "9 PM" },
  { category: "Describing Time", thai: "สี่ทุ่ม", en: "10 PM" },
  { category: "Describing Time", thai: "ห้าทุ่ม", en: "11 PM" },
  { category: "Describing Time", thai: "นาที", en: "minute" },
  { category: "Describing Time", thai: "ชั่วโมง", en: "hour" },
  { category: "Describing Time", thai: "ครึ่งชั่วโมง", en: "half an hour" },
  { category: "Describing Time", thai: "ไตรมาส", en: "quarter (of an hour)" },
  { category: "Describing Time", thai: "วินาที", en: "second" },
  { category: "Describing Time", thai: "วันนี้", en: "today" },
  { category: "Describing Time", thai: "เมื่อวาน", en: "yesterday" },
  { category: "Describing Time", thai: "พรุ่งนี้", en: "tomorrow" },
  { category: "Describing Time", thai: "มะรืนนี้", en: "the day after tomorrow" },
  { category: "Describing Time", thai: "เมื่อวานซืน", en: "the day before yesterday" },
  { category: "Describing Time", thai: "เช้านี้", en: "this morning" },
  { category: "Describing Time", thai: "คืนนี้", en: "tonight" },
  { category: "Describing Time", thai: "สัปดาห์นี้", en: "this week" },
  { category: "Describing Time", thai: "สัปดาห์ที่แล้ว", en: "last week" },
  { category: "Describing Time", thai: "สัปดาห์หน้า", en: "next week" },
  { category: "Describing Time", thai: "เดือนนี้", en: "this month" },
  { category: "Describing Time", thai: "เดือนที่แล้ว", en: "last month" },
  { category: "Describing Time", thai: "เดือนหน้า", en: "next month" },
  { category: "Describing Time", thai: "ปีนี้", en: "this year" },
  { category: "Describing Time", thai: "ปีที่แล้ว", en: "last year" },
  { category: "Describing Time", thai: "ปีหน้า", en: "next year" },
  { category: "Describing Time", thai: "วันจันทร์", en: "Monday" },
  { category: "Describing Time", thai: "วันอังคาร", en: "Tuesday" },
  { category: "Describing Time", thai: "วันพุธ", en: "Wednesday" },
  { category: "Describing Time", thai: "วันพฤหัสบดี", en: "Thursday" },
  { category: "Describing Time", thai: "วันศุกร์", en: "Friday" },
  { category: "Describing Time", thai: "วันเสาร์", en: "Saturday" },
  { category: "Describing Time", thai: "วันอาทิตย์", en: "Sunday" },
  { category: "Describing Time", thai: "มกราคม", en: "January" },
  { category: "Describing Time", thai: "กุมภาพันธ์", en: "February" },
  { category: "Describing Time", thai: "มีนาคม", en: "March" },
  { category: "Describing Time", thai: "เมษายน", en: "April" },
  { category: "Describing Time", thai: "พฤษภาคม", en: "May" },
  { category: "Describing Time", thai: "มิถุนายน", en: "June" },
  { category: "Describing Time", thai: "กรกฎาคม", en: "July" },
  { category: "Describing Time", thai: "สิงหาคม", en: "August" },
  { category: "Describing Time", thai: "กันยายน", en: "September" },
  { category: "Describing Time", thai: "ตุลาคม", en: "October" },
  { category: "Describing Time", thai: "พฤศจิกายน", en: "November" },
  { category: "Describing Time", thai: "ธันวาคม", en: "December" },
  { category: "Describing Time", thai: "บ่อยๆ", en: "often / frequently" },
  { category: "Describing Time", thai: "บางครั้ง", en: "sometimes" },
  { category: "Describing Time", thai: "นานๆ ครั้ง", en: "rarely / occasionally" },
  { category: "Describing Time", thai: "ไม่เคย", en: "never" },
  { category: "Describing Time", thai: "เสมอ", en: "always" },
  { category: "Describing Time", thai: "ส่วนใหญ่", en: "usually / mostly" },
  { category: "Describing Time", thai: "เร็วๆ นี้", en: "soon / recently" },
  { category: "Describing Time", thai: "นานแล้ว", en: "long ago" },
  { category: "Describing Time", thai: "ทันที", en: "immediately / right away" },
  { category: "Describing Time", thai: "ชั่วคราว", en: "temporary / temporarily" },
  { category: "Describing Time", thai: "ถาวร", en: "permanent / permanently" },
  { category: "Describing Time", thai: "ต่อไป", en: "next / going forward" },
  { category: "Describing Time", thai: "ก่อน", en: "before / previously" },
  { category: "Describing Time", thai: "หลังจาก", en: "after" },
  { category: "Describing Time", thai: "ในที่สุด", en: "finally / eventually" },
  { category: "Describing Time", thai: "ระหว่าง", en: "during / between" },
  { category: "Describing Time", thai: "ตั้งแต่", en: "since / from" },
  { category: "Describing Time", thai: "จนถึง", en: "until" },
  { category: "Describing Time", thai: "ตลอดเวลา", en: "all the time" },
  { category: "Describing Time", thai: "เที่ยงวัน", en: "midday / noon (formal)" },
  { category: "Describing Time", thai: "เที่ยงคืน", en: "midnight" },
  { category: "Describing Time", thai: "รุ่งเช้า", en: "at dawn / at daybreak" },
  { category: "Describing Time", thai: "ดึก", en: "late at night" },
  { category: "Describing Time", thai: "ฤดูร้อน", en: "summer / hot season" },
  { category: "Describing Time", thai: "ฤดูฝน", en: "rainy season" },
  { category: "Describing Time", thai: "ฤดูหนาว", en: "winter / cool season" },
  { category: "Describing Time", thai: "ฤดูใบไม้ผลิ", en: "spring" },
  { category: "Describing Time", thai: "ฤดูใบไม้ร่วง", en: "autumn / fall" },
  { category: "Describing Time", thai: "ทศวรรษ", en: "decade" },
  { category: "Describing Time", thai: "ศตวรรษ", en: "century" },
  { category: "Daily Objects", thai: "โทรศัพท์", en: "telephone / phone" },
  { category: "Daily Objects", thai: "โทรศัพท์มือถือ", en: "mobile phone" },
  { category: "Daily Objects", thai: "คอมพิวเตอร์", en: "computer" },
  { category: "Daily Objects", thai: "แล็ปท็อป", en: "laptop" },
  { category: "Daily Objects", thai: "แท็บเล็ต", en: "tablet" },
  { category: "Daily Objects", thai: "โทรทัศน์", en: "television" },
  { category: "Daily Objects", thai: "รีโมทคอนโทรล", en: "remote control" },
  { category: "Daily Objects", thai: "กล้องถ่ายรูป", en: "camera" },
  { category: "Daily Objects", thai: "หูฟัง", en: "earphones / headphones" },
  { category: "Daily Objects", thai: "ลำโพง", en: "speaker" },
  { category: "Daily Objects", thai: "ที่ชาร์จ", en: "charger" },
  { category: "Daily Objects", thai: "สายไฟ", en: "cable / wire" },
  { category: "Daily Objects", thai: "ปลั๊กไฟ", en: "power socket / plug" },
  { category: "Daily Objects", thai: "กุญแจ", en: "key" },
  { category: "Daily Objects", thai: "กระเป๋าสตางค์", en: "wallet" },
  { category: "Daily Objects", thai: "กระเป๋าถือ", en: "handbag / purse" },
  { category: "Daily Objects", thai: "ร่ม", en: "umbrella" },
  { category: "Daily Objects", thai: "แว่นตา", en: "glasses / spectacles" },
  { category: "Daily Objects", thai: "นาฬิกาข้อมือ", en: "wristwatch" },
  { category: "Daily Objects", thai: "เข็มขัด", en: "belt" },
  { category: "Daily Objects", thai: "เสื้อ", en: "shirt / top" },
  { category: "Daily Objects", thai: "กางเกง", en: "trousers / pants" },
  { category: "Daily Objects", thai: "กระโปรง", en: "skirt" },
  { category: "Daily Objects", thai: "ชุดเดรส", en: "dress" },
  { category: "Daily Objects", thai: "รองเท้า", en: "shoes" },
  { category: "Daily Objects", thai: "ถุงเท้า", en: "socks" },
  { category: "Daily Objects", thai: "หมวก", en: "hat / cap" },
  { category: "Daily Objects", thai: "ผ้าพันคอ", en: "scarf" },
  { category: "Daily Objects", thai: "แจ็คเก็ต", en: "jacket" },
  { category: "Daily Objects", thai: "เสื้อโค้ท", en: "coat" },
  { category: "Daily Objects", thai: "ผ้าห่ม", en: "blanket" },
  { category: "Daily Objects", thai: "หมอน", en: "pillow" },
  { category: "Daily Objects", thai: "ผ้าขนหนู", en: "towel" },
  { category: "Daily Objects", thai: "แปรงสีฟัน", en: "toothbrush" },
  { category: "Daily Objects", thai: "ยาสีฟัน", en: "toothpaste" },
  { category: "Daily Objects", thai: "สบู่", en: "soap" },
  { category: "Daily Objects", thai: "แชมพู", en: "shampoo" },
  { category: "Daily Objects", thai: "กระจก", en: "mirror" },
  { category: "Daily Objects", thai: "หวี", en: "comb" },
  { category: "Daily Objects", thai: "กรรไกร", en: "scissors" },
  { category: "Daily Objects", thai: "เข็ม", en: "needle" },
  { category: "Daily Objects", thai: "ด้าย", en: "thread" },
  { category: "Daily Objects", thai: "กระดาษ", en: "paper" },
  { category: "Daily Objects", thai: "ดินสอ", en: "pencil" },
  { category: "Daily Objects", thai: "ปากกา", en: "pen" },
  { category: "Daily Objects", thai: "ยางลบ", en: "eraser" },
  { category: "Daily Objects", thai: "ไม้บรรทัด", en: "ruler" },
  { category: "Daily Objects", thai: "สมุด", en: "notebook" },
  { category: "Daily Objects", thai: "ซอง", en: "envelope" },
  { category: "Daily Objects", thai: "แสตมป์", en: "stamp (postal)" },
  { category: "Daily Objects", thai: "กาว", en: "glue" },
  { category: "Daily Objects", thai: "เทป", en: "tape" },
  { category: "Daily Objects", thai: "ตะปู", en: "nail (hardware)" },
  { category: "Daily Objects", thai: "ค้อน", en: "hammer" },
  { category: "Daily Objects", thai: "ไขควง", en: "screwdriver" },
  { category: "Daily Objects", thai: "ถุงพลาสติก", en: "plastic bag" },
  { category: "Daily Objects", thai: "กล่อง", en: "box" },
  { category: "Daily Objects", thai: "ถัง", en: "bucket / bin" },
  { category: "Daily Objects", thai: "ไม้กวาด", en: "broom" },
  { category: "Daily Objects", thai: "ผ้าถู", en: "mop" },
  { category: "Daily Objects", thai: "ผ้าเช็ดมือ", en: "hand towel / cloth" },
  { category: "Daily Objects", thai: "ไฟฉาย", en: "torch / flashlight" },
  { category: "Daily Objects", thai: "เทียน", en: "candle" },
  { category: "Daily Objects", thai: "ไม้ขีดไฟ", en: "matches" },
  { category: "Daily Objects", thai: "ไฟแช็ก", en: "lighter" },
  { category: "Daily Objects", thai: "ยา", en: "medicine" },
  { category: "Daily Objects", thai: "พลาสเตอร์", en: "plaster / bandage" },
  { category: "Daily Objects", thai: "เทอร์โมมิเตอร์", en: "thermometer" },
  { category: "Daily Objects", thai: "โต๊ะ", en: "table / desk" },
  { category: "Daily Objects", thai: "เก้าอี้", en: "chair" },
  { category: "Daily Objects", thai: "ชั้นวางของ", en: "shelf" },
  { category: "Daily Objects", thai: "ตู้", en: "cabinet / wardrobe" },
  { category: "Daily Objects", thai: "โซฟา", en: "sofa" },
  { category: "Daily Objects", thai: "เตียง", en: "bed" },
  { category: "Daily Objects", thai: "ตู้เย็น", en: "refrigerator" },
  { category: "Daily Objects", thai: "เตาไฟ", en: "stove / cooker" },
  { category: "Daily Objects", thai: "กระทะ", en: "frying pan / wok" },
  { category: "Daily Objects", thai: "หม้อ", en: "pot" },
  { category: "Daily Objects", thai: "เตาอบ", en: "oven" },
  { category: "Daily Objects", thai: "ไมโครเวฟ", en: "microwave" },
  { category: "Daily Objects", thai: "เครื่องซักผ้า", en: "washing machine" },
  { category: "Daily Objects", thai: "เครื่องดูดฝุ่น", en: "vacuum cleaner" },
  { category: "Daily Objects", thai: "พัดลม", en: "fan" },
  { category: "Daily Objects", thai: "หลอดไฟ", en: "light bulb" },
  { category: "Daily Objects", thai: "สวิตช์ไฟ", en: "light switch" },
  { category: "Daily Objects", thai: "ลูกบิด", en: "door handle / knob" },
  { category: "Daily Objects", thai: "กล่องใส่ยา", en: "pill box / medicine organiser" },
  { category: "Daily Objects", thai: "ที่เปิดขวด", en: "bottle opener" },
  { category: "Daily Objects", thai: "ที่เปิดกระป๋อง", en: "can opener" },
  { category: "Daily Objects", thai: "ตะแกรง", en: "rack / strainer / grill" },
  { category: "Daily Objects", thai: "เขียง", en: "chopping board" },
  { category: "Daily Objects", thai: "ช้อนส้อม", en: "cutlery (spoon and fork)" },
  { category: "Daily Objects", thai: "ปฏิทิน", en: "calendar" },
  { category: "Daily Objects", thai: "นาฬิกาแขวน", en: "wall clock" },
  { category: "Daily Objects", thai: "กระดิ่ง", en: "bell" },
  { category: "Daily Objects", thai: "กล่องดินสอ", en: "pencil case" },
  { category: "Daily Objects", thai: "แฟ้ม", en: "folder / file" },
  { category: "Frequently Used Verbs", thai: "เป็น", en: "to be" },
  { category: "Frequently Used Verbs", thai: "มี", en: "to have / there is" },
  { category: "Frequently Used Verbs", thai: "ทำ", en: "to do / to make" },
  { category: "Frequently Used Verbs", thai: "ไป", en: "to go" },
  { category: "Frequently Used Verbs", thai: "มา", en: "to come" },
  { category: "Frequently Used Verbs", thai: "กลับ", en: "to return / go back" },
  { category: "Frequently Used Verbs", thai: "ออก", en: "to exit / go out" },
  { category: "Frequently Used Verbs", thai: "เข้า", en: "to enter / go in" },
  { category: "Frequently Used Verbs", thai: "ขึ้น", en: "to go up / increase" },
  { category: "Frequently Used Verbs", thai: "ลง", en: "to go down / decrease" },
  { category: "Frequently Used Verbs", thai: "กิน", en: "to eat" },
  { category: "Frequently Used Verbs", thai: "ดื่ม", en: "to drink" },
  { category: "Frequently Used Verbs", thai: "นอน", en: "to sleep / lie down" },
  { category: "Frequently Used Verbs", thai: "ตื่น", en: "to wake up" },
  { category: "Frequently Used Verbs", thai: "อาบน้ำ", en: "to shower / bathe" },
  { category: "Frequently Used Verbs", thai: "แต่งตัว", en: "to get dressed" },
  { category: "Frequently Used Verbs", thai: "ซื้อ", en: "to buy" },
  { category: "Frequently Used Verbs", thai: "ขาย", en: "to sell" },
  { category: "Frequently Used Verbs", thai: "จ่าย", en: "to pay" },
  { category: "Frequently Used Verbs", thai: "ให้", en: "to give" },
  { category: "Frequently Used Verbs", thai: "รับ", en: "to receive / accept" },
  { category: "Frequently Used Verbs", thai: "เอา", en: "to take / get" },
  { category: "Frequently Used Verbs", thai: "เปิด", en: "to open / turn on" },
  { category: "Frequently Used Verbs", thai: "ปิด", en: "to close / turn off" },
  { category: "Frequently Used Verbs", thai: "หยุด", en: "to stop" },
  { category: "Frequently Used Verbs", thai: "เริ่ม", en: "to start / begin" },
  { category: "Frequently Used Verbs", thai: "ทำงาน", en: "to work" },
  { category: "Frequently Used Verbs", thai: "เรียน", en: "to study / learn" },
  { category: "Frequently Used Verbs", thai: "สอน", en: "to teach" },
  { category: "Frequently Used Verbs", thai: "อ่าน", en: "to read" },
  { category: "Frequently Used Verbs", thai: "เขียน", en: "to write" },
  { category: "Frequently Used Verbs", thai: "ฟัง", en: "to listen" },
  { category: "Frequently Used Verbs", thai: "ดู", en: "to watch / look" },
  { category: "Frequently Used Verbs", thai: "มอง", en: "to look at / gaze" },
  { category: "Frequently Used Verbs", thai: "หา", en: "to search / look for" },
  { category: "Frequently Used Verbs", thai: "พบ", en: "to find / meet" },
  { category: "Frequently Used Verbs", thai: "รอ", en: "to wait" },
  { category: "Frequently Used Verbs", thai: "ช่วย", en: "to help" },
  { category: "Frequently Used Verbs", thai: "ใช้", en: "to use" },
  { category: "Frequently Used Verbs", thai: "เล่น", en: "to play" },
  { category: "Frequently Used Verbs", thai: "วิ่ง", en: "to run" },
  { category: "Frequently Used Verbs", thai: "เดิน", en: "to walk" },
  { category: "Frequently Used Verbs", thai: "นั่ง", en: "to sit" },
  { category: "Frequently Used Verbs", thai: "ยืน", en: "to stand" },
  { category: "Frequently Used Verbs", thai: "กระโดด", en: "to jump" },
  { category: "Frequently Used Verbs", thai: "ว่ายน้ำ", en: "to swim" },
  { category: "Frequently Used Verbs", thai: "ขับ", en: "to drive / ride" },
  { category: "Frequently Used Verbs", thai: "บิน", en: "to fly" },
  { category: "Frequently Used Verbs", thai: "ซ่อม", en: "to repair / fix" },
  { category: "Frequently Used Verbs", thai: "สร้าง", en: "to build / create" },
  { category: "Frequently Used Verbs", thai: "ทำลาย", en: "to destroy / break" },
  { category: "Frequently Used Verbs", thai: "เปลี่ยน", en: "to change" },
  { category: "Frequently Used Verbs", thai: "เพิ่ม", en: "to add / increase" },
  { category: "Frequently Used Verbs", thai: "ลด", en: "to reduce / decrease" },
  { category: "Frequently Used Verbs", thai: "จอง", en: "to reserve / book" },
  { category: "Frequently Used Verbs", thai: "ยืม", en: "to borrow" },
  { category: "Frequently Used Verbs", thai: "คืน", en: "to return (an item)" },
  { category: "Frequently Used Verbs", thai: "ส่ง", en: "to send / deliver" },
  { category: "Frequently Used Verbs", thai: "รับ", en: "to receive" },
  { category: "Frequently Used Verbs", thai: "โทร", en: "to call (phone)" },
  { category: "Frequently Used Verbs", thai: "ถ่ายรูป", en: "to take a photo" },
  { category: "Frequently Used Verbs", thai: "แชร์", en: "to share" },
  { category: "Frequently Used Verbs", thai: "ดาวน์โหลด", en: "to download" },
  { category: "Frequently Used Verbs", thai: "อัปโหลด", en: "to upload" },
  { category: "Frequently Used Verbs", thai: "ล้าง", en: "to wash / clean" },
  { category: "Frequently Used Verbs", thai: "ทำความสะอาด", en: "to clean up" },
  { category: "Frequently Used Verbs", thai: "ปรุง", en: "to cook / prepare (food)" },
  { category: "Frequently Used Verbs", thai: "หุง", en: "to cook rice / boil" },
  { category: "Frequently Used Verbs", thai: "ทอด", en: "to fry / deep fry" },
  { category: "Frequently Used Verbs", thai: "ต้ม", en: "to boil" },
  { category: "Frequently Used Verbs", thai: "ย่าง", en: "to grill / roast" },
  { category: "Frequently Used Verbs", thai: "ตัด", en: "to cut" },
  { category: "Frequently Used Verbs", thai: "ฉีก", en: "to tear / rip" },
  { category: "Frequently Used Verbs", thai: "พับ", en: "to fold" },
  { category: "Frequently Used Verbs", thai: "เปิด", en: "to open" },
  { category: "Frequently Used Verbs", thai: "แบก", en: "to carry (on back)" },
  { category: "Frequently Used Verbs", thai: "ถือ", en: "to hold / carry (in hand)" },
  { category: "Frequently Used Verbs", thai: "วาง", en: "to place / put down" },
  { category: "Frequently Used Verbs", thai: "เก็บ", en: "to collect / keep / put away" },
  { category: "Frequently Used Verbs", thai: "ทิ้ง", en: "to throw away / abandon" },
  { category: "Frequently Used Verbs", thai: "ลืม", en: "to forget" },
  { category: "Frequently Used Verbs", thai: "จำ", en: "to remember" },
  { category: "Frequently Used Verbs", thai: "รัก", en: "to love" },
  { category: "Frequently Used Verbs", thai: "ชอบ", en: "to like" },
  { category: "Frequently Used Verbs", thai: "เกลียด", en: "to hate / dislike strongly" },
  { category: "Frequently Used Verbs", thai: "หัวเราะ", en: "to laugh" },
  { category: "Frequently Used Verbs", thai: "ร้องไห้", en: "to cry" },
  { category: "Frequently Used Verbs", thai: "ยิ้ม", en: "to smile" },
  { category: "Frequently Used Verbs", thai: "พักผ่อน", en: "to rest / relax" },
  { category: "Frequently Used Verbs", thai: "ฝัน", en: "to dream" },
  { category: "Frequently Used Verbs", thai: "คุย", en: "to chat / talk" },
  { category: "Frequently Used Verbs", thai: "เจอ", en: "to meet / encounter" },
  { category: "Frequently Used Verbs", thai: "ชนะ", en: "to win" },
  { category: "Frequently Used Verbs", thai: "แพ้", en: "to lose / be defeated" },
  { category: "Frequently Used Verbs", thai: "ลอง", en: "to try / attempt" },
  { category: "Frequently Used Verbs", thai: "เลือก", en: "to choose / select" },
  { category: "Frequently Used Verbs", thai: "ตัดสินใจ", en: "to decide" },
  { category: "Frequently Used Verbs", thai: "เตรียม", en: "to prepare" },
  { category: "Frequently Used Verbs", thai: "นับ", en: "to count" },
  { category: "Frequently Used Verbs", thai: "วัด", en: "to measure" },
  { category: "Hobbies", thai: "อ่านหนังสือ", en: "reading books" },
  { category: "Hobbies", thai: "เขียนหนังสือ", en: "writing / creative writing" },
  { category: "Hobbies", thai: "วาดรูป", en: "drawing / painting" },
  { category: "Hobbies", thai: "ระบายสี", en: "colouring / watercolour painting" },
  { category: "Hobbies", thai: "ถ่ายรูป", en: "photography" },
  { category: "Hobbies", thai: "เล่นดนตรี", en: "playing music" },
  { category: "Hobbies", thai: "ร้องเพลง", en: "singing" },
  { category: "Hobbies", thai: "เต้นรำ", en: "dancing" },
  { category: "Hobbies", thai: "ดูหนัง", en: "watching films / movies" },
  { category: "Hobbies", thai: "ดูซีรีส์", en: "watching TV series" },
  { category: "Hobbies", thai: "ฟังเพลง", en: "listening to music" },
  { category: "Hobbies", thai: "เล่นเกม", en: "playing games / gaming" },
  { category: "Hobbies", thai: "เล่นเกมวิดีโอ", en: "playing video games" },
  { category: "Hobbies", thai: "เล่นกีฬา", en: "playing sport" },
  { category: "Hobbies", thai: "ออกกำลังกาย", en: "exercising" },
  { category: "Hobbies", thai: "วิ่ง", en: "running / jogging" },
  { category: "Hobbies", thai: "ว่ายน้ำ", en: "swimming" },
  { category: "Hobbies", thai: "ขี่จักรยาน", en: "cycling" },
  { category: "Hobbies", thai: "โยคะ", en: "yoga" },
  { category: "Hobbies", thai: "ปีนเขา", en: "mountain climbing / hiking" },
  { category: "Hobbies", thai: "เดินป่า", en: "hiking / trekking" },
  { category: "Hobbies", thai: "ตกปลา", en: "fishing" },
  { category: "Hobbies", thai: "ทำอาหาร", en: "cooking" },
  { category: "Hobbies", thai: "อบขนม", en: "baking" },
  { category: "Hobbies", thai: "ทำสวน", en: "gardening" },
  { category: "Hobbies", thai: "ปลูกต้นไม้", en: "growing plants" },
  { category: "Hobbies", thai: "เลี้ยงสัตว์", en: "keeping pets" },
  { category: "Hobbies", thai: "ท่องเที่ยว", en: "travelling / sightseeing" },
  { category: "Hobbies", thai: "เดินทาง", en: "travelling" },
  { category: "Hobbies", thai: "ท่องเที่ยวธรรมชาติ", en: "nature travel / ecotourism" },
  { category: "Hobbies", thai: "ดูนก", en: "birdwatching" },
  { category: "Hobbies", thai: "ดูดาว", en: "stargazing" },
  { category: "Hobbies", thai: "นั่งสมาธิ", en: "meditation" },
  { category: "Hobbies", thai: "เล่นหมากรุก", en: "playing chess" },
  { category: "Hobbies", thai: "เล่นไพ่", en: "playing cards" },
  { category: "Hobbies", thai: "จิ๊กซอว์", en: "jigsaw puzzle" },
  { category: "Hobbies", thai: "สะสมของ", en: "collecting (things)" },
  { category: "Hobbies", thai: "สะสมแสตมป์", en: "stamp collecting" },
  { category: "Hobbies", thai: "สะสมหนังสือ", en: "book collecting" },
  { category: "Hobbies", thai: "ทำงานฝีมือ", en: "crafts / handiwork" },
  { category: "Hobbies", thai: "ถักโครเชต์", en: "crocheting" },
  { category: "Hobbies", thai: "ถักเย็บ", en: "knitting / sewing" },
  { category: "Hobbies", thai: "เย็บผ้า", en: "sewing" },
  { category: "Hobbies", thai: "ทำเครื่องประดับ", en: "jewellery making" },
  { category: "Hobbies", thai: "ปั้นดิน", en: "pottery / sculpting with clay" },
  { category: "Hobbies", thai: "ประดิษฐ์", en: "crafting / DIY making" },
  { category: "Hobbies", thai: "ทำของเล่น", en: "making toys / models" },
  { category: "Hobbies", thai: "ต่อโมเดล", en: "building models" },
  { category: "Hobbies", thai: "เล่นบอร์ดเกม", en: "playing board games" },
  { category: "Hobbies", thai: "เล่นโบว์ลิ่ง", en: "bowling" },
  { category: "Hobbies", thai: "ตีกอล์ฟ", en: "playing golf" },
  { category: "Hobbies", thai: "เล่นเทนนิส", en: "playing tennis" },
  { category: "Hobbies", thai: "เล่นแบดมินตัน", en: "playing badminton" },
  { category: "Hobbies", thai: "เล่นฟุตบอล", en: "playing football" },
  { category: "Hobbies", thai: "เล่นบาสเกตบอล", en: "playing basketball" },
  { category: "Hobbies", thai: "เล่นวอลเลย์บอล", en: "playing volleyball" },
  { category: "Hobbies", thai: "ดูกีฬา", en: "watching sport" },
  { category: "Hobbies", thai: "ท่องอินเทอร์เน็ต", en: "browsing the internet" },
  { category: "Hobbies", thai: "ดูยูทูบ", en: "watching YouTube" },
  { category: "Hobbies", thai: "ทำบล็อก", en: "blogging" },
  { category: "Hobbies", thai: "ทำพอดแคสต์", en: "podcasting" },
  { category: "Hobbies", thai: "เรียนภาษา", en: "language learning" },
  { category: "Hobbies", thai: "เรียนทำอาหาร", en: "taking cooking classes" },
  { category: "Hobbies", thai: "ช้อปปิ้ง", en: "shopping" },
  { category: "Hobbies", thai: "เดินตลาด", en: "browsing markets" },
  { category: "Hobbies", thai: "ไปคาเฟ่", en: "going to cafés" },
  { category: "Hobbies", thai: "ท่องคาเฟ่", en: "café hopping" },
  { category: "Hobbies", thai: "ชิมอาหาร", en: "food tasting / food tours" },
  { category: "Hobbies", thai: "ชมนิทรรศการ", en: "visiting exhibitions" },
  { category: "Hobbies", thai: "ไปคอนเสิร์ต", en: "going to concerts" },
  { category: "Hobbies", thai: "ไปโรงละคร", en: "going to the theatre" },
  { category: "Hobbies", thai: "ทำงานอาสา", en: "volunteering" },
  { category: "Hobbies", thai: "เขียนบทกวี", en: "writing poetry" },
  { category: "Hobbies", thai: "เขียนไดอารี่", en: "keeping a diary / journalling" },
  { category: "Hobbies", thai: "ทำวิดีโอ", en: "making videos / vlogging" },
  { category: "Hobbies", thai: "แต่งเพลง", en: "songwriting / composing music" },
  { category: "Hobbies", thai: "เล่นกีตาร์", en: "playing guitar" },
  { category: "Hobbies", thai: "เล่นเปียโน", en: "playing piano" },
  { category: "Hobbies", thai: "เล่นกลอง", en: "playing drums" },
  { category: "Hobbies", thai: "เล่นไวโอลิน", en: "playing violin" },
  { category: "Hobbies", thai: "ดูพระอาทิตย์ตก", en: "watching the sunset" },
  { category: "Hobbies", thai: "เล่นโดรน", en: "flying drones" },
  { category: "Hobbies", thai: "ขับรถเที่ยว", en: "road tripping" },
  { category: "Hobbies", thai: "นอนอ่านหนังสือ", en: "reading in bed / leisure reading" },
  { category: "Hobbies", thai: "ดูละครเวที", en: "watching stage plays" },
  { category: "Hobbies", thai: "ไปงานเทศกาล", en: "attending festivals" },
  { category: "Hobbies", thai: "เล่นพิน-ปอง", en: "playing table tennis" },
  { category: "Hobbies", thai: "ยกน้ำหนัก", en: "weightlifting" },
  { category: "Hobbies", thai: "มวยไทย", en: "Muay Thai" },
  { category: "Hobbies", thai: "ดำน้ำ", en: "scuba diving / snorkelling" },
  { category: "Hobbies", thai: "โต้คลื่น", en: "surfing" },
  { category: "Hobbies", thai: "เล่นสเก็ตบอร์ด", en: "skateboarding" },
  { category: "Hobbies", thai: "ขี่ม้า", en: "horse riding" },
  { category: "Hobbies", thai: "เล่นสโนว์บอร์ด", en: "snowboarding" },
  { category: "Hobbies", thai: "เล่นสกี", en: "skiing" },
  { category: "Hobbies", thai: "เล่นรักบี้", en: "playing rugby" },
  { category: "Hobbies", thai: "เล่นซอฟต์บอล", en: "playing softball" },
  { category: "Hobbies", thai: "เล่นคริกเก็ต", en: "playing cricket" },
  { category: "Colours", thai: "แดง", en: "red" },
  { category: "Colours", thai: "ส้ม", en: "orange" },
  { category: "Colours", thai: "เหลือง", en: "yellow" },
  { category: "Colours", thai: "เขียว", en: "green" },
  { category: "Colours", thai: "น้ำเงิน", en: "blue (dark blue / navy)" },
  { category: "Colours", thai: "ฟ้า", en: "light blue / sky blue" },
  { category: "Colours", thai: "ม่วง", en: "purple" },
  { category: "Colours", thai: "ชมพู", en: "pink" },
  { category: "Colours", thai: "น้ำตาล", en: "brown" },
  { category: "Colours", thai: "เทา", en: "grey" },
  { category: "Colours", thai: "ดำ", en: "black" },
  { category: "Colours", thai: "ขาว", en: "white" },
  { category: "Colours", thai: "ทอง", en: "gold" },
  { category: "Colours", thai: "เงิน", en: "silver" },
  { category: "Colours", thai: "เบจ", en: "beige" },
  { category: "Colours", thai: "ครีม", en: "cream" },
  { category: "Colours", thai: "แดงเข้ม", en: "dark red / maroon" },
  { category: "Colours", thai: "ชมพูอ่อน", en: "light pink / pale pink" },
  { category: "Colours", thai: "เขียวอ่อน", en: "light green" },
  { category: "Colours", thai: "เขียวเข้ม", en: "dark green" },
  { category: "Colours", thai: "เหลืองอ่อน", en: "pale yellow / lemon" },
  { category: "Colours", thai: "ฟ้าอ่อน", en: "pale blue / baby blue" },
  { category: "Colours", thai: "ม่วงอ่อน", en: "lavender / lilac" },
  { category: "Colours", thai: "น้ำตาลแดง", en: "reddish-brown / rust" },
  { category: "Colours", thai: "น้ำตาลเข้ม", en: "dark brown" },
  { category: "Colours", thai: "เทาอ่อน", en: "light grey" },
  { category: "Colours", thai: "เทาเข้ม", en: "dark grey / charcoal" },
  { category: "Colours", thai: "ส้มอ่อน", en: "pale orange / peach" },
  { category: "Colours", thai: "ฟ้าเข้ม", en: "deep blue / indigo" },
  { category: "Colours", thai: "เขียวมรกต", en: "emerald green" },
  { category: "Colours", thai: "เขียวมิ้นต์", en: "mint green" },
  { category: "Colours", thai: "ส้มแดง", en: "reddish-orange / coral" },
  { category: "Colours", thai: "ม่วงแดง", en: "magenta / crimson-purple" },
  { category: "Colours", thai: "ฟ้าคราม", en: "indigo" },
  { category: "Colours", thai: "เหลืองทอง", en: "golden yellow" },
  { category: "Colours", thai: "แดงสด", en: "bright red / scarlet" },
  { category: "Colours", thai: "ส้มสด", en: "vivid orange" },
  { category: "Colours", thai: "เขียวสด", en: "vivid / lime green" },
  { category: "Colours", thai: "ฟ้าสด", en: "bright blue / cyan" },
  { category: "Colours", thai: "ม่วงสด", en: "vivid purple" },
  { category: "Colours", thai: "ชมพูสด", en: "hot pink / fuchsia" },
  { category: "Colours", thai: "เทาเขียว", en: "sage green / grey-green" },
  { category: "Colours", thai: "น้ำเงินอมเขียว", en: "teal" },
  { category: "Colours", thai: "แดงชมพู", en: "rosy red" },
  { category: "Colours", thai: "น้ำตาลทอง", en: "caramel / golden brown" },
  { category: "Colours", thai: "เหลืองอมเขียว", en: "yellow-green / chartreuse" },
  { category: "Colours", thai: "ฟ้าอมเขียว", en: "aqua / aquamarine" },
  { category: "Colours", thai: "ม่วงชมพู", en: "mauve / pink-purple" },
  { category: "Colours", thai: "ส้มทอง", en: "amber / golden orange" },
  { category: "Colours", thai: "ฟ้าเทา", en: "slate blue" },
  { category: "Colours", thai: "เขียวเทา", en: "slate green / khaki" },
  { category: "Weather", thai: "อากาศ", en: "weather / climate" },
  { category: "Weather", thai: "อุณหภูมิ", en: "temperature" },
  { category: "Weather", thai: "แสงแดด", en: "sunlight / sunshine" },
  { category: "Weather", thai: "แดด", en: "sun / sunny" },
  { category: "Weather", thai: "ร้อน", en: "hot" },
  { category: "Weather", thai: "อบอุ่น", en: "warm" },
  { category: "Weather", thai: "เย็น", en: "cool / cold" },
  { category: "Weather", thai: "หนาว", en: "cold (feeling cold)" },
  { category: "Weather", thai: "ฝน", en: "rain" },
  { category: "Weather", thai: "ฝนตก", en: "it is raining / raining" },
  { category: "Weather", thai: "ฟ้าร้อง", en: "thunder" },
  { category: "Weather", thai: "ฟ้าแลบ", en: "lightning" },
  { category: "Weather", thai: "พายุ", en: "storm" },
  { category: "Weather", thai: "พายุฝน", en: "rainstorm" },
  { category: "Weather", thai: "พายุฝนฟ้าคะนอง", en: "thunderstorm" },
  { category: "Weather", thai: "พายุไต้ฝุ่น", en: "typhoon" },
  { category: "Weather", thai: "เมฆ", en: "cloud" },
  { category: "Weather", thai: "เมฆมาก", en: "cloudy / overcast" },
  { category: "Weather", thai: "หมอก", en: "fog / mist" },
  { category: "Weather", thai: "หมอกควัน", en: "smog" },
  { category: "Weather", thai: "ลม", en: "wind" },
  { category: "Weather", thai: "ลมแรง", en: "strong wind / windy" },
  { category: "Weather", thai: "ลมเย็น", en: "cool breeze / cold wind" },
  { category: "Weather", thai: "ลมร้อน", en: "hot wind" },
  { category: "Weather", thai: "อากาศดี", en: "good weather / nice day" },
  { category: "Weather", thai: "อากาศแย่", en: "bad weather" },
  { category: "Weather", thai: "อากาศร้อนชื้น", en: "hot and humid weather" },
  { category: "Weather", thai: "ชื้น", en: "humid" },
  { category: "Weather", thai: "แห้ง", en: "dry" },
  { category: "Weather", thai: "แล้ง", en: "drought / dry spell" },
  { category: "Weather", thai: "น้ำท่วม", en: "flood / flooding" },
  { category: "Weather", thai: "แดดจัด", en: "blazing sun / very sunny" },
  { category: "Weather", thai: "ฝนปรอยๆ", en: "drizzle" },
  { category: "Weather", thai: "ฝนหนัก", en: "heavy rain" },
  { category: "Weather", thai: "ฝนกระหน่ำ", en: "downpour" },
  { category: "Weather", thai: "รุ้ง", en: "rainbow" },
  { category: "Weather", thai: "หิมะ", en: "snow" },
  { category: "Weather", thai: "น้ำค้าง", en: "dew" },
  { category: "Weather", thai: "น้ำค้างแข็ง", en: "frost" },
  { category: "Weather", thai: "พยากรณ์อากาศ", en: "weather forecast" },
  { category: "Weather", thai: "ดัชนีความร้อน", en: "heat index" },
  { category: "Weather", thai: "ความกดอากาศ", en: "air pressure" },
  { category: "Weather", thai: "ภูมิอากาศ", en: "climate" },
  { category: "Weather", thai: "ฤดูร้อน", en: "hot season / summer" },
  { category: "Weather", thai: "ฤดูฝน", en: "rainy season" },
  { category: "Weather", thai: "ฤดูหนาว", en: "cool / cold season" },
  { category: "Weather", thai: "อากาศสดชื่น", en: "fresh / crisp air" },
  { category: "Weather", thai: "แสงแดดอ่อน", en: "mild sunshine" },
  { category: "Weather", thai: "เงาเมฆ", en: "cloud shadow" },
  { category: "Weather", thai: "ท้องฟ้า", en: "sky" },
  { category: "Weather", thai: "ท้องฟ้าโปร่ง", en: "clear sky" },
  { category: "Weather", thai: "พระอาทิตย์", en: "sun (the sun)" },
  { category: "Weather", thai: "พระจันทร์", en: "moon" },
  { category: "Travelling", thai: "แผนการเดินทาง", en: "travel itinerary" },
  { category: "Describing Time", thai: "ตลอดทั้งวัน", en: "all day long" },
  { category: "Hobbies", thai: "เล่นแฮนด์บอล", en: "playing handball" },
  { category: "Hobbies", thai: "เล่นฮ็อกกี้", en: "playing hockey" },
  { category: "Daily Objects", thai: "กล่องใส่ข้าว", en: "lunchbox / food container" },
  { category: "Daily Objects", thai: "ถุงผ้า", en: "cloth bag / tote bag" },
  { category: "Daily Objects", thai: "สมุดบัญชี", en: "account book / ledger" }

];

const CATEGORIES = [...new Set(ALL_VOCAB.map(v => v.category))];

/* ── HELPERS ── */
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const LETTERS = ["A", "B", "C", "D"];

const getGrade = pct => {
  if (pct === 100) return { icon: "🏆", label: "Perfect!",         msg: "Flawless round. Your memory is sharp." };
  if (pct >= 87)   return { icon: "⭐", label: "Excellent",         msg: "Almost perfect — just a slip or two." };
  if (pct >= 73)   return { icon: "👍", label: "Good",              msg: "Solid effort. A bit more drilling on the misses." };
  if (pct >= 60)   return { icon: "📖", label: "Keep going",        msg: "Getting there — review the flagged words." };
  return               { icon: "💪", label: "Keep practising",   msg: "Don't be discouraged — repetition is how it sticks." };
};

const ringColour = pct => pct >= 80 ? "var(--jade)" : pct >= 50 ? "var(--gold)" : "var(--vermilion)";

const speak = (text, lang, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang || "th-TH";
  u.rate = lang === "en-GB" ? 0.95 : 0.85;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
};

const cancelSpeak = () => window.speechSynthesis?.cancel();

/* ── CATEGORY ICONS ── */
const CAT_ICONS = {
  "Fundamentals":          "🔤",
  "Food & Drink":          "🍜",
  "Travelling":            "✈️",
  "Describing Time":       "🕐",
  "Daily Objects":         "🏠",
  "Frequently Used Verbs": "⚡",
  "Hobbies":               "🎯",
  "Colours":               "🎨",
  "Weather":               "🌤️",
};

/* ═══════════════════════════════════════════
   SETUP SCREEN
═══════════════════════════════════════════ */
function SetupScreen({ onStart }) {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [mode, setMode]       = useState("visual");
  const [qCount, setQCount]   = useState(15);
  const [error, setError]     = useState("");

  const vocab = ALL_VOCAB.filter(v => v.category === selectedCat);

  const startQuiz = () => {
    if (vocab.length < 4) {
      setError(`This category only has ${vocab.length} word${vocab.length !== 1 ? 's' : ''} — reduce the round size to ${vocab.length} or fewer.`);
      return;
    }
    onStart({ vocab, mode, qCount });
  };

  return (
    <div className="screen-enter" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'DM Sans', sans-serif" }}>
      <FontLoader />

      {/* Sticky top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--paper)", borderBottom: "2px solid var(--aged)",
        padding: "0.6rem 1rem",
        display: "flex", flexDirection: "column", gap: "0.5rem",
        boxShadow: "0 2px 8px var(--shadow)"
      }}>
        {/* Row 1: word count + start button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--jade)", marginRight: 4 }}>{vocab.length}</span>
            words
          </div>
          <button onClick={startQuiz} style={{
            background: "var(--jade)", color: "#fff", border: "none",
            padding: "0.55rem 1.3rem", borderRadius: 8, fontWeight: 700,
            fontSize: "0.9rem", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>Start →</button>
        </div>
        {/* Row 2: question count */}
        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginRight: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>Questions</span>
          {[5, 10, 15, 20].map(n => (
            <button key={n} onClick={() => setQCount(n)} style={{
              padding: "0.22rem 0.6rem", borderRadius: 6, border: "2px solid",
              borderColor: qCount === n ? "var(--gold)" : "var(--aged)",
              background: qCount === n ? "rgba(200,146,42,0.1)" : "transparent",
              color: qCount === n ? "var(--gold)" : "var(--muted)",
              fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}>{n}</button>
          ))}
        </div>
        {error && <span style={{ fontSize: "0.72rem", color: "var(--vermilion)" }}>{error}</span>}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.2rem 1rem 5rem" }}>

        {/* Title */}
        <div style={{ textAlign: "center", padding: "1rem 0 1.2rem", borderBottom: "2px solid var(--gold)", marginBottom: "1.2rem" }}>
          <div style={{ fontFamily: "'Noto Serif Thai', serif", fontSize: "1.5rem", color: "var(--gold)", marginBottom: 4 }}>ไพ่คำศัพท์</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--ink)", letterSpacing: "-0.02em" }}>Thai Vocab Trainer</h1>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>
            {ALL_VOCAB.length} words across {CATEGORIES.length} categories
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem", fontWeight: 600 }}>Practice Mode</div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
              { id: "visual", icon: "👁", label: "Visual",  desc: "See the Thai word, pick the English meaning" },
              { id: "audio",  icon: "🔊", label: "Audio",   desc: "Hear the word, don't see it" },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                flex: 1, padding: "0.65rem 0.8rem", borderRadius: 10,
                border: `2px solid ${mode === m.id ? "var(--gold)" : "var(--aged)"}`,
                background: mode === m.id ? "rgba(200,146,42,0.07)" : "#fff",
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif"
              }}>
                <div style={{ fontSize: "1.3rem", marginBottom: 2 }}>{m.icon}</div>
                <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.95rem" }}>{m.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category selection */}
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "0.75rem" }}>
            Category
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
            {CATEGORIES.map(cat => {
              const count = ALL_VOCAB.filter(v => v.category === cat).length;
              const active = selectedCat === cat;
              return (
                <button key={cat} onClick={() => { setSelectedCat(cat); setError(""); }} style={{
                  padding: "0.6rem 0.75rem", borderRadius: 10,
                  border: `2px solid ${active ? "var(--gold)" : "var(--aged)"}`,
                  background: active ? "rgba(200,146,42,0.08)" : "#fff",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{CAT_ICONS[cat] || "📚"}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: active ? "var(--gold)" : "var(--ink)" }}>{cat}</span>
                    {active && <span style={{ marginLeft: "auto", color: "var(--gold)", fontSize: "0.9rem" }}>●</span>}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", paddingLeft: "1.6rem" }}>{count} words</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUIZ LOGIC
═══════════════════════════════════════════ */
function buildQuestions(vocab, qCount) {
  // Each word appears at most once per round — shuffle and slice
  const pool = shuffle([...vocab]).slice(0, qCount);
  return pool.map(item => {
    // Randomly decide direction: "th" = show Thai, answer English
    //                            "en" = show English, answer Thai
    const dir = Math.random() < 0.5 ? "th" : "en";
    const others = shuffle(vocab.filter(v => v.thai !== item.thai));
    const distractors = others.slice(0, 3);
    const opts = shuffle([item, ...distractors]);
    return { item, opts, dir };
  });
}

/* ═══════════════════════════════════════════
   QUIZ SCREEN
═══════════════════════════════════════════ */
function QuizScreen({ vocab, mode, qCount, round, onExit, onFinish }) {
  const [questions]    = useState(() => buildQuestions(vocab, qCount));
  const [currentQ, setCurrentQ]   = useState(0);
  const [answered, setAnswered]   = useState(false);
  const [chosen, setChosen]       = useState(null);
  const [score, setScore]         = useState(0);
  const [missedWords, setMissedWords] = useState([]);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [speaking, setSpeaking]       = useState(false);
  const [showReplay, setShowReplay]   = useState(false);

  const scoreRef  = useRef(0);
  const missedRef = useRef([]);
  useEffect(() => { scoreRef.current = score; },       [score]);
  useEffect(() => { missedRef.current = missedWords; }, [missedWords]);

  const q      = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  useEffect(() => {
    setAnswered(false);
    setChosen(null);
    setAudioPlayed(false);
    setSpeaking(false);
    setShowReplay(false);

    if (mode === "audio") {
      const t = setTimeout(() => {
        setSpeaking(true);
        speak(
          q.dir === "en" ? q.item.en : q.item.thai,
          q.dir === "en" ? "en-GB" : "th-TH",
          () => { setSpeaking(false); setShowReplay(true); setAudioPlayed(true); }
        );
      }, 400);
      return () => { clearTimeout(t); cancelSpeak(); };
    }
  }, [currentQ]);

  const handleSpeak = () => {
    setSpeaking(true);
    speak(
      q.dir === "en" ? q.item.en : q.item.thai,
      q.dir === "en" ? "en-GB" : "th-TH",
      () => { setSpeaking(false); setShowReplay(true); setAudioPlayed(true); }
    );
  };

  const handleAnswer = idx => {
    if (answered) return;
    setAnswered(true);
    setChosen(idx);
    const correct = q.opts[idx].thai === q.item.thai;
    if (correct) setScore(s => s + 1);
    else         setMissedWords(mw => [...mw, { thai: q.item.thai, en: q.item.en, dir: q.dir }]);
  };

  const handleNext = () => {
    cancelSpeak();
    if (isLast) {
      onFinish({ finalScore: scoreRef.current, missedWords: missedRef.current, total: questions.length });
    } else {
      setCurrentQ(c => c + 1);
    }
  };

  const progress   = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;
  const isCorrect  = answered && chosen !== null && q.opts[chosen].thai === q.item.thai;

  return (
    <div className="screen-enter" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'DM Sans', sans-serif" }}>
      <FontLoader />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--ink)", color: "var(--paper)",
        padding: "0.6rem 0.9rem",
        display: "flex", alignItems: "center", gap: "0.6rem"
      }}>
        <button onClick={() => { cancelSpeak(); onExit(); }} style={{
          background: "none", border: "1.5px solid rgba(255,255,255,0.2)", color: "var(--paper)",
          padding: "0.28rem 0.75rem", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem",
          fontFamily: "'DM Sans', sans-serif", flexShrink: 0
        }}>← Exit</button>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>Round {round}</div>
        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--gold)", borderRadius: 2, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>
          {score} / {currentQ + (answered ? 1 : 0)}
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "1rem 0.9rem 2rem" }}>

        {/* Question card */}
        <div style={{
          background: "#fff", borderRadius: 14, padding: "1.4rem 1.2rem 1.2rem",
          boxShadow: "0 4px 24px var(--shadow)", marginBottom: "1rem", textAlign: "center",
          border: "1px solid var(--aged)"
        }}>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Question {currentQ + 1} of {questions.length}
          </div>

          {mode === "visual" ? (
            <>
              {q.dir === "th" ? (
                /* Show Thai word — answers are English */
                <div style={{
                  fontFamily: "'Noto Serif Thai', serif",
                  fontSize: "clamp(2rem, 10vw, 3.2rem)",
                  color: "var(--ink)", lineHeight: 1.4, marginBottom: "0.8rem"
                }}>
                  {q.item.thai}
                </div>
              ) : (
                /* Show English word — answers are Thai */
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.4rem, 7vw, 2.4rem)",
                  color: "var(--ink)", lineHeight: 1.3, marginBottom: "0.8rem",
                  letterSpacing: "-0.01em"
                }}>
                  {q.item.en}
                </div>
              )}
              <button onClick={handleSpeak} title="Pronounce" style={{
                background: "none", border: "none", fontSize: "1.5rem",
                cursor: "pointer", transition: "transform 0.15s"
              }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              >{speaking ? "🔉" : "🔊"}</button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0" }}>
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleSpeak}
                  className={!audioPlayed ? "pulse-ring" : ""}
                  style={{
                    width: 72, height: 72, borderRadius: "50%", border: "none",
                    background: audioPlayed ? "var(--jade)" : "var(--gold)",
                    color: "#fff", fontSize: "1.9rem", cursor: "pointer",
                    transition: "background 0.3s", position: "relative", zIndex: 1
                  }}
                >▶</button>
              </div>
              {showReplay && (
                <button onClick={handleSpeak} style={{
                  background: "none", border: "1.5px solid var(--aged)",
                  color: "var(--muted)", padding: "0.3rem 0.9rem", borderRadius: 6,
                  cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif"
                }}>↺ Replay</button>
              )}
            </div>
          )}

          <div style={{ marginTop: "0.75rem" }}>
            <span style={{
              display: "inline-block", fontSize: "0.7rem", fontWeight: 600,
              background: q.dir === "th" ? "rgba(200,146,42,0.1)" : "rgba(46,125,94,0.1)",
              color: q.dir === "th" ? "var(--gold)" : "var(--jade)",
              border: q.dir === "th" ? "1px solid rgba(200,146,42,0.3)" : "1px solid rgba(46,125,94,0.3)",
              padding: "0.2rem 0.7rem", borderRadius: 20
            }}>
              {q.dir === "th" ? "🇬🇧 Choose the English meaning" : "🇹🇭 เลือกคำภาษาไทย"}
            </span>
          </div>
        </div>

        {/* Answer options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.9rem" }}>
          {q.opts.map((opt, idx) => {
            const correct  = opt.thai === q.item.thai;
            const isChosen = chosen === idx;
            let bg = "#fff", border = "1.5px solid var(--aged)", color = "var(--ink)";
            let badgeBg = "var(--ink)", icon = LETTERS[idx];

            if (answered) {
              if (correct)        { bg = "rgba(46,125,94,0.08)";   border = "2px solid var(--jade)";      color = "var(--jade)";      badgeBg = "var(--jade)";      icon = "✓"; }
              else if (isChosen)  { bg = "rgba(192,57,43,0.08)";   border = "2px solid var(--vermilion)"; color = "var(--vermilion)"; badgeBg = "var(--vermilion)"; icon = "✗"; }
              else                { color = "var(--muted)"; badgeBg = "var(--aged)"; }
            }

            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} style={{
                background: bg, border, borderRadius: 10,
                padding: "0.85rem 0.75rem", cursor: answered ? "default" : "pointer",
                textAlign: "left", transition: "all 0.15s", color,
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseOver={e => { if (!answered) e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.borderWidth = "1.5px"; }}
                onMouseOut={e => { if (!answered) { e.currentTarget.style.border = "1.5px solid var(--aged)"; } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 4,
                    background: badgeBg, color: "#fff",
                    fontSize: "0.68rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>{icon}</span>
                  {q.dir === "th" ? (
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.3 }}>{opt.en}</span>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.3, fontFamily: "'Noto Serif Thai', serif" }}>{opt.thai}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        {answered && (
          <div style={{
            background: isCorrect ? "rgba(46,125,94,0.08)" : "rgba(192,57,43,0.06)",
            border: `1.5px solid ${isCorrect ? "var(--jade)" : "var(--vermilion)"}`,
            borderRadius: 8, padding: "0.7rem 1rem",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem"
          }}>
            <span style={{ fontWeight: 600, color: isCorrect ? "var(--jade)" : "var(--vermilion)", fontSize: "0.88rem" }}>
              {isCorrect ? "✓ Correct!" : "✗ Wrong — the correct answer is highlighted."}
            </span>
            <button onClick={handleNext} style={{
              background: "var(--jade)", color: "#fff", border: "none",
              padding: "0.45rem 1.1rem", borderRadius: 7, fontWeight: 700,
              cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.15s", whiteSpace: "nowrap", flexShrink: 0
            }}
              onMouseOver={e => e.currentTarget.style.background = "var(--jade-lt)"}
              onMouseOut={e => e.currentTarget.style.background = "var(--jade)"}
            >{isLast ? "See results →" : "Next →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCORE RING
═══════════════════════════════════════════ */
function ScoreRing({ pct }) {
  const r = 80, circ = 2 * Math.PI * r;
  return (
    <svg width="160" height="160" viewBox="0 0 200 200" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="100" cy="100" r={r} fill="none" stroke="var(--aged)" strokeWidth="12" />
      <circle
        cx="100" cy="100" r={r} fill="none"
        stroke={ringColour(pct)} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.4s" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   RESULTS SCREEN
═══════════════════════════════════════════ */
function ResultsScreen({ finalScore, total, missedWords, round, onPlayAgain, onEdit }) {
  const pct   = Math.round((finalScore / total) * 100);
  const grade = getGrade(pct);
  const seen = new Set();
  const unique = missedWords.filter(w => { if (seen.has(w.thai)) return false; seen.add(w.thai); return true; });
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => { const t = setTimeout(() => setDisplayPct(pct), 100); return () => clearTimeout(t); }, [pct]);

  return (
    <div className="screen-enter" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'DM Sans', sans-serif" }}>
      <FontLoader />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "'Noto Serif Thai', serif", fontSize: "0.9rem", color: "var(--gold)", marginBottom: 4 }}>Round {round} Complete</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", color: "var(--ink)" }}>Results</h1>
        </div>

        <div style={{ position: "relative", width: 160, margin: "0 auto 1.2rem" }}>
          <ScoreRing pct={displayPct} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", color: "var(--ink)", lineHeight: 1 }}>{finalScore}</div>
            <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>/ {total}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{grade.icon}</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "var(--ink)", marginBottom: "0.3rem" }}>{grade.label}</div>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)", fontStyle: "italic" }}>{grade.msg}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "1.2rem" }}>
          {[
            { label: "Correct",  val: finalScore,        col: "var(--jade)" },
            { label: "Wrong",    val: total-finalScore,  col: "var(--vermilion)" },
            { label: "Accuracy", val: `${pct}%`,         col: "var(--gold)" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "0.7rem 0.5rem", textAlign: "center", border: "1px solid var(--aged)" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: s.col }}>{s.val}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {unique.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "0.9rem", marginBottom: "1.2rem", border: "1px solid var(--aged)" }}>
            <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.8rem", marginBottom: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Words to Review</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {unique.map((w, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", gap: "0.6rem",
                  background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.2)",
                  borderRadius: 7, padding: "0.45rem 0.8rem"
                }}>
                  <span style={{
                    fontFamily: "'Noto Serif Thai', serif", fontSize: "1.05rem",
                    color: "var(--vermilion)", fontWeight: 600, flexShrink: 0
                  }}>{w.thai}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>—</span>
                  <span style={{ color: "var(--ink)", fontSize: "0.85rem" }}>{w.en}</span>
                  <span style={{
                    marginLeft: "auto", flexShrink: 0,
                    fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.04em",
                    background: w.dir === "th" ? "rgba(200,146,42,0.1)" : "rgba(46,125,94,0.1)",
                    color: w.dir === "th" ? "var(--gold)" : "var(--jade)",
                    border: w.dir === "th" ? "1px solid rgba(200,146,42,0.3)" : "1px solid rgba(46,125,94,0.3)",
                    padding: "0.15rem 0.5rem", borderRadius: 10
                  }}>{w.dir === "th" ? "TH→EN" : "EN→TH"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onEdit} style={{
            flex: 1, padding: "0.85rem", borderRadius: 8,
            border: "1.5px solid var(--aged)", background: "transparent",
            color: "var(--ink)", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem",
            fontFamily: "'DM Sans', sans-serif"
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = "var(--gold)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "var(--aged)"}
          >← Change categories</button>
          <button onClick={onPlayAgain} style={{
            flex: 1, padding: "0.85rem", borderRadius: 8,
            border: "none", background: "var(--jade)", color: "#fff",
            fontWeight: 700, cursor: "pointer", fontSize: "0.88rem",
            fontFamily: "'DM Sans', sans-serif"
          }}
            onMouseOver={e => e.currentTarget.style.background = "var(--jade-lt)"}
            onMouseOut={e => e.currentTarget.style.background = "var(--jade)"}
          >Play again →</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]   = useState("setup");
  const [config, setConfig]   = useState(null);
  const [round, setRound]     = useState(1);
  const [results, setResults] = useState(null);

  if (screen === "quiz" && config) return (
    <QuizScreen
      key={round}
      vocab={config.vocab} mode={config.mode} qCount={config.qCount} round={round}
      onExit={() => { setRound(r => r + 1); setScreen("setup"); }}
      onFinish={res => { setResults(res); setScreen("results"); }}
    />
  );

  if (screen === "results" && results) return (
    <ResultsScreen
      finalScore={results.finalScore} total={results.total}
      missedWords={results.missedWords} round={round}
      onPlayAgain={() => { setRound(r => r + 1); setScreen("quiz"); }}
      onEdit={() => setScreen("setup")}
    />
  );

  return <SetupScreen onStart={cfg => { setConfig(cfg); setScreen("quiz"); }} />;
}