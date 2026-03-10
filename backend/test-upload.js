import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function testUpload() {
    try {
        // Login first
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'user@demo.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Got token', token);

        const form = new FormData();
        form.append('document', fs.createReadStream('test.txt'));
        form.append('title', 'test.txt');
        form.append('approverEmail', 'approver@demo.com');
        form.append('isUrgent', 'true');

        const uploadRes = await axios.post('http://localhost:5000/api/documents', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Upload success:', uploadRes.data);
    } catch (e) {
        console.error('Upload failed:', e.response ? e.response.data : e.message);
    }
}

fs.writeFileSync('test.txt', 'hello world');
testUpload();
