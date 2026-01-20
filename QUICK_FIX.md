# Quick Fix: MongoDB Connection Issue

## 🎯 Current Problem
Server starts but can't connect to MongoDB Atlas:
```
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.jl4ntmm.mongodb.net
```

## ✅ Quick Solution (5 minutes)

### Step 1: Go to MongoDB Atlas
1. Visit https://cloud.mongodb.com/
2. Log in with your account
3. Select your project

### Step 2: Whitelist Your IP
1. Click "Network Access" in the left sidebar
2. Click "ADD IP ADDRESS" button
3. Click "ADD CURRENT IP ADDRESS"
   - Or click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) for testing
4. Click "Confirm"
5. Wait 1-2 minutes for the change to take effect

### Step 3: Verify Connection String
1. Click "Database" in the left sidebar
2. Click "Connect" on your Cluster0
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with: `fj5ADJME3w1Qvtng`
6. Update `.env` file if different:
   ```env
   MONGODB_URI=mongodb+srv://koiwilliam91_db_user:fj5ADJME3w1Qvtng@cluster0.jl4ntmm.mongodb.net/directory-app?retryWrites=true&w=majority
   ```

### Step 4: Test Connection
```bash
cd /Users/william/Dev_Projects/WK\ STUDIO/directory-app/back-end
node test-mongo.js
```

Expected output:
```
✅ Successfully connected to MongoDB Atlas!
```

### Step 5: Restart Server
```bash
# Stop current server
pkill -f "nest start"

# Start fresh
npm run start:dev
```

## 🧪 Test Everything Works

### Test Signup
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test12345678","name":"Test User"}' | jq .
```

### Test Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test12345678"}' | jq .
```

## 🎉 Success Indicators

You should see:
- ✅ Server starts without MongoDB errors
- ✅ Signup returns user object with JWT token
- ✅ Login returns session with access_token
- ✅ Companies and contacts endpoints respond

## ⚠️ Still Having Issues?

### Check Database User
1. In MongoDB Atlas, go to "Database Access"
2. Verify `koiwilliam91_db_user` exists
3. Click "Edit" and ensure:
   - Password is correct
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Database Access: At least "Read and write to any database"

### Check Cluster Status
1. Go to "Database" in MongoDB Atlas
2. Verify Cluster0 shows as "Active" (green)
3. If paused, click "Resume" button

### Test with Standard Connection String
Try the standard (non-SRV) connection string format:
```env
MONGODB_URI=mongodb://koiwilliam91_db_user:fj5ADJME3w1Qvtng@cluster0-shard-00-00.jl4ntmm.mongodb.net:27017,cluster0-shard-00-01.jl4ntmm.mongodb.net:27017,cluster0-shard-00-02.jl4ntmm.mongodb.net:27017/directory-app?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority
```

Get this from MongoDB Atlas → Connect → Connect your application → Use the dropdown to select "Standard" instead of "SRV"

## 📞 Contact Information

If still stuck:
- Check `MIGRATION_STATUS.md` for detailed troubleshooting
- Check `MONGODB_MIGRATION.md` for complete migration details
- Check MongoDB Atlas logs: Database → ... menu → View Monitoring

## ✨ That's It!

Once the connection works, your full-stack directory app is migrated to MongoDB!
