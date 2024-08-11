'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { db } from '@/firebase';
import { collection, getDocs, setDoc, deleteDoc, doc, getDoc, DocumentData } from 'firebase/firestore';

interface InventoryItem {
  id: string;
  quantity: number;
}

const Home = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(db, 'inventory'));
    const items = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<InventoryItem, 'id'>;
      return {
        id: doc.id,
        ...data,
      };
    });
    setInventory(items);
  };

  const addItem = async (item: string) => {
    if (!item) return;
    const itemRef = doc(collection(db, 'inventory'), item);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      const currentData = itemSnap.data() as InventoryItem;
      await setDoc(itemRef, { quantity: currentData.quantity + 1 });
    } else {
      await setDoc(itemRef, { quantity: 1 });
    }
    updateInventory();
  };

  const removeItem = async (item: string) => {
    if (!item) return;
    const itemRef = doc(collection(db, 'inventory'), item);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      const currentData = itemSnap.data() as InventoryItem;
      if (currentData.quantity > 1) {
        await setDoc(itemRef, { quantity: currentData.quantity - 1 });
      } else {
        await deleteDoc(itemRef);
      }
    }
    updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box textAlign="center">
      <Typography variant="h2">Pantry Tracker</Typography>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6">Add a new item</Typography>
          <TextField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              setOpen(false);
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Stack spacing={2}>
        {inventory.map((item) => (
          <Box key={item.id} display="flex" justifyContent="space-between">
            <Typography>{item.id}</Typography>
            <Typography>{item.quantity}</Typography>
            <Button onClick={() => removeItem(item.id)}>Remove</Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Home;
