import { connectionPool } from '../health1/db.js';

async function deleteUser(userId) {
    const connection = await connectionPool.getConnection();
    try {
        // Obtenir une connexion à partir du pool

        // Supprimer l'utilisateur
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
        console.log('suppression reussie');

        // Vérifier si une ligne a été supprimée
        if (result.affectedRows > 0) {
            console.log(`Utilisateur avec l'ID ${userId} supprimé avec succès.`);
        } else {
            console.log(`Aucun utilisateur trouvé avec l'ID ${userId}.`);
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
    } finally {
        // Libérer la connexion
        if (connection) connection.release();
    } 
}

// Exemple d'utilisation
deleteUser(1); // Remplacez "1" par l'ID de l'utilisateur que vous souhaitez supprimer

async function deleteNutrition() { 
    const connection = await connectionPool.getConnection();
    try { 
        const {end} = await connection.execute('DELETE FROM nutrition');
        console.log("suppresion réussie");
    } 
    catch (err) { 
        console.error(err.message);  
    }
    finally { 
        connection.release();
    }
}

deleteNutrition();
