# Wiki-Graph Second Brain Pattern

Source: YouTube video summary (Obsidian + Claude/Cursor)
Date: 2026-04-16
Tags: wiki-graph, knowledge-management, obsidian, ingest, second-brain, RAG

## Content

แนวคิด Wiki-Graph แทนที่ RAG แบบเดิม:
- เปลี่ยนจาก vector DB มาเป็น Wiki-Graph structure ใน Obsidian
- ประหยัด token มากกว่า, ความสัมพันธ์เชิงลึกดีกว่า
- ไม่ต้องใช้ embedding model หรือ DB ซับซ้อน
- เหมาะสำหรับเอกสารระดับหลักร้อยหน้า (ไม่ใช่หมื่นหน้า)

เครื่องมือ:
- Obsidian: note-taking + graph view
- Cursor/Claude: AI agent อ่าน/เขียน/จัดระเบียบ notes อัตโนมัติ
- Web Clipper: ดึงข้อมูลจากเว็บเข้า Obsidian

3 ขั้นตอนหลัก:
1. เตรียมข้อมูล → raw folder
2. Prompt พิเศษ → AI สร้างไฟล์สรุป + ไฟล์เชื่อมโยง
3. Ingest → AI ประมวลผล raw → คลังความรู้ที่ cite ได้แม่นยำ

ประโยชน์:
- AI จดจำบริบทโปรเจกต์ระยะยาว
- Health check ตรวจสอบ gap ในความรู้
- Citation แม่นยำ

## Key Concepts

- Wiki-Graph > RAG สำหรับ small-medium knowledge base
- raw → admit → room → backlinks คือ ingest flow
- Citation ทำให้ AI ตอบได้แม่นยำและ traceable
