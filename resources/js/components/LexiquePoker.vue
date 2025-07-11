<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Lexique Poker</h1>

    <!-- Recherche + Tri -->
    <div class="flex justify-between items-center mb-4">
      <input v-model="recherche" placeholder="Rechercher un terme ou une catégorie..." class="input" />
      <select v-model="cleTri" class="input ml-4 w-40">
        <option value="Catégorie">Catégorie</option>
        <option value="Terme">Terme</option>
        <option value="Définition">Définition</option>
      </select>
      <button @click="triAscendant = !triAscendant" class="btn ml-2">
        Trier {{ triAscendant ? '⬆️' : '⬇️' }}
      </button>
    </div>

    <!-- Liste -->
    <div>
      <h2 class="text-xl font-semibold mb-2">Termes</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="p-2 border">Catégorie</th>
            <th class="p-2 border">Terme</th>
            <th class="p-2 border">Définition</th>
            <th class="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="terme in termesFiltresTries" :key="terme.id" class="border-t">
            <template v-if="termeEnEdition?.id === terme.id">
              <td class="p-2 border"><input v-model="termeEnEdition.Catégorie" class="input" /></td>
              <td class="p-2 border"><input v-model="termeEnEdition.Terme" class="input" /></td>
              <td class="p-2 border"><textarea v-model="termeEnEdition.Définition" class="input"></textarea></td>
              <td class="p-2 border text-center">
                <button @click="validerEdition(termeEnEdition)" class="btn mr-2">✅</button>
                <button @click="termeEnEdition = null" class="btn bg-gray-400 hover:bg-gray-500">❌</button>
              </td>
            </template>
            <template v-else>
              <td class="p-2 border">{{ terme.Catégorie }}</td>
              <td class="p-2 border">{{ terme.Terme }}</td>
              <td class="p-2 border">{{ terme.Définition }}</td>
              <td class="p-2 border text-center">
                <button @click="editerTerme(terme)" class="text-blue-600 hover:text-blue-800 mr-2"
                  title="Modifier">✏️</button>
                <button @click="supprimerTerme(terme.id)" class="text-red-600 hover:text-red-800"
                  title="Supprimer">🗑️</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ajout -->
    <div class="mt-8 add-therme">
      <h2 class="text-xl font-semibold mb-2">Ajouter un terme</h2>
      <form @submit.prevent="ajouterTerme" class="space-y-2">
        <input v-model="nouveauTerme.Catégorie" placeholder="Catégorie" class="input" required />
        <input v-model="nouveauTerme.Terme" placeholder="Terme" class="input" required />
        <textarea v-model="nouveauTerme.Définition" placeholder="Définition" class="input" required></textarea>
        <button type="submit" class="btn">Ajouter</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'LexiquePoker',
  setup() {
    const termes = ref<any[]>([])
    const nouveauTerme = ref({ Catégorie: '', Terme: '', Définition: '' })
    const termeEnEdition = ref<any | null>(null)
    const recherche = ref('')
    const triAscendant = ref(true)
    const cleTri = ref<'Catégorie' | 'Terme' | 'Définition'>('Catégorie')

    const chargerTermes = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/lexique')
      termes.value = await res.json()
    }

    const ajouterTerme = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/lexique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauTerme.value),
      })
      if (res.ok) {
        const data = await res.json()
        termes.value.push(data)
        nouveauTerme.value = { Catégorie: '', Terme: '', Définition: '' }
      }
    }

    const editerTerme = (terme: any) => {
      termeEnEdition.value = { ...terme }
    }

    const validerEdition = async (termeModifie: any) => {
      const res = await fetch(`http://127.0.0.1:8000/api/lexique/${termeModifie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Catégorie: termeModifie.Catégorie,
          Terme: termeModifie.Terme,
          Définition: termeModifie.Définition,
        }),
      })

      if (res.ok) {
        const index = termes.value.findIndex(t => t.id === termeModifie.id)
        if (index !== -1) {
          termes.value[index] = { ...termeModifie }
          termeEnEdition.value = null
        }
      }
    }

    const supprimerTerme = async (id: string) => {
      const confirmation = window.confirm('Es-tu sûr de vouloir supprimer ce terme ?')
      if (!confirmation) return

      const res = await fetch(`http://127.0.0.1:8000/api/lexique/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        termes.value = termes.value.filter(t => t.id !== id)
      } else {
        alert("Une erreur est survenue lors de la suppression.")
      }
    }

    const termesFiltresTries = computed(() => {
      return termes.value
        .filter(t =>
          t.Terme.toLowerCase().includes(recherche.value.toLowerCase()) ||
          t.Catégorie.toLowerCase().includes(recherche.value.toLowerCase()) ||
          t.Définition.toLowerCase().includes(recherche.value.toLowerCase())
        )
        .sort((a, b) => {
          const valA = a[cleTri.value].toLowerCase()
          const valB = b[cleTri.value].toLowerCase()
          if (valA < valB) return triAscendant.value ? -1 : 1
          if (valA > valB) return triAscendant.value ? 1 : -1
          return 0
        })
    })

    onMounted(() => {
      chargerTermes()
      window.addEventListener('submit', e => e.preventDefault())
    })

    return {
      termes,
      nouveauTerme,
      ajouterTerme,
      supprimerTerme,
      editerTerme,
      validerEdition,
      termeEnEdition,
      recherche,
      termesFiltresTries,
      triAscendant,
      cleTri,
    }
  },
})
</script>

<style scoped>
.input {
  width: 45%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}

.add-therme .input {
  width: 100%;
}

.btn {
  padding: 0.4rem 0.8rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #1d4ed8;
}

table {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
