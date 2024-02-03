import express from 'express';
// import { getUsers, addUser, getUserById, editUser, deleteUser } from '../controller/user-controller.js';
import { addSong, deleteSong, editSong, getSong, getSongById,} from '../controller/song-controller.js';

const router = express.Router();

// router.get('/', getUsers);
// router.post('/add', addUser);
// router.get('/:id', getUserById);
// router.put('/:id', editUser);
// router.delete('/:id', deleteUser);

router.get('/', getSong);
router.post('/add', addSong);
router.get('/:id', getSongById);
router.put('/:id', editSong);
router.delete('/:id', deleteSong);



export default router;