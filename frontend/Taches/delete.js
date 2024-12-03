import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
    host: 'localhost',
    user: 'Nûr',
    password: '17/Juin/2006',
    database: 'collab_db',
});

async function deleteAll() {
    const connection = await pool.getConnection();
    try {
        // Démarrer une transaction
        await connection.beginTransaction();

        // Supprimer tous les messages
        await connection.execute('DELETE FROM messages');
        console.log('Tous les messages ont été supprimés.');

        // Supprimer toutes les tâches
        await connection.execute('DELETE FROM tasks');
        console.log('Toutes les tâches ont été supprimées.');

        // Valider la transaction
        await connection.commit();
        console.log('Transaction réussie, toutes les suppressions ont été effectuées.');
    } catch (error) {
        console.error('Erreur lors de la suppression des messages et des tâches :', error);
        
        // Annuler la transaction en cas d'erreur
        await connection.rollback();
        console.log('Transaction annulée.');
    } finally {
        connection.release();
    }
}

// Exécuter la fonction
deleteAll()
    .then(() => {
        console.log('Exécution terminée.');
        pool.end(); // Fermer la connexion au pool
    })
    .catch(error => {
        console.error('Erreur lors de l\'exécution :', error);
        pool.end();
    });