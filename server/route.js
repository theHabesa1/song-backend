import express from 'express';

import { addSong, deleteSong, editSong, getSong, getSongById,} from '../controller/song-controller.js';

const router = express.Router();



router.get('/', getSong);
router.post('/add', addSong);
router.get('/:id', getSongById);
router.put('/:id', editSong);
router.delete('/:id', deleteSong);



export default router;
