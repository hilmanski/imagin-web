<template>
  <Loading v-if="loading"/>

  <div v-else>
  <div class="columns">
    <div class="column is-half mb-5">
        <div class="columns is-flex">
          <figure class="image is-64x64 mr-2">
            <img class="is-rounded" :src="user.picture">
          </figure>
          <div>
            <h2>Hi {{ user.nickname }}</h2>
            <div v-if="prev_site != ''" class="is-flex">
              <input class="input is-small" v-model="new_site" placeholder="https://your.site"/>
              <button class="button is-info is-light is-small" @click="updateSite">Update Site</button>  
            </div>
          </div>
        </div> 
    </div>
  </div>
  
  <div v-if="prev_site == ''">
    <p>First, add your site</p>
    <input class="input is-fullwidth" v-model="new_site" placeholder="https://your.site" />
    <button class="button is-fullwidth is-primary mt-2" @click="addSite">Add Site</button>  
  </div>

  <div v-else>
    <div class="columns">
      <div class="column">  
        <p class='has-text-weight-semibold'>Image preview</p>
        <iframe :src="iframe_src" title="Image template preview"
            width="500" height="300" class='mb-2'>
        </iframe>
        
        <div class='is-flex is-align-items-center is-justify-content-space-between'>
          <p class='has-text-weight-semibold'>Image Code</p> <button class='button is-small' @click='copycode'>Copy Code</button>
        </div>

        <p class="codelink mt-1 mb-1"> {{ api_link }}</p>
        <p> <small> You can use above link to generate dynamic social image in  your meta tags. Just change 'title' value dynamically based on your programmign language</small></p>
      </div>
 
     <div class="column">  </div>
  
     <div class="column is-5">
      <p class='has-text-weight-semibold mb-2'>Customize your template: </p>

      <div class='control is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4">Text Color: </label> 
        <input v-model="theme.text_color" type="color" class="input is-small" />
      </div>
      
      <div class='control is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4"> Background Color: </label> 
        <input v-model="theme.bg_color" type="color" class="input is-small" />
      </div>

      <div class='control is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4"> Logo URL: </label> 
        <input v-model="theme.logo_src" type="text" class="input is-small" placeholder="url link"/>
      </div>

      <div class='control is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4"> Background URL: </label> 
        <input v-model="theme.background_src" type="text" class="input is-small" placeholder="url link"/>
      </div>

      <div class='control is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4"> Font Family </label> 
        <select v-model="theme.fontfamily" class="select is-fullwidth is-small">
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>
      </div>
      
      <div class=' is-flex is-align-items-center mb-2'>
        <label class="column pl-0 is-4"> Text Align: </label> 
        <select v-model="theme.align" class="select is-fullwidth is-small">
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </div>

      <button class="button is-info is-small is-fullwidth" @click="saveSetting">Save and Preview</button>
  </div>

  </div>
  </div>
  </div>
</template>

<script>
import Loading from '../components/Loading.vue'

export default{
  data() {
    return {
      loading: true,
      user: this.$auth.user,
      base_API: 'https://imagin-api.deta.dev', //'http://localhost:5000'
      new_site: '',
      prev_site: '',
      site_key: null,
      api_link: '',
      iframe_src: '',
      theme: {
        text_color: '#333333',
        bg_color: '#ffffff',
        logo_src: '',
        background_src: '',
        align: 'left',
        fontfamily: 'sans-serif',
      },
    }
  },
  components: {
    Loading
  },
  mounted() {
    this.previewImage() //init for first user
    this.checkUserSite()
  },
  methods: {
    async getHeaders() {
      const token = await this.$auth.getTokenSilently();
      return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    },

    validateWebsite(sitename) {
        const siteRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        if(!sitename.match(new RegExp(siteRegex))) {
          alert('must be a website with http(s)://')
          return false
        }
        return true
    },

    async addSite() {
      const _this = this
      const sitename = this.new_site.trim()

      if(!this.validateWebsite(sitename)) return

      fetch(`${this.base_API}/sites`, {
        method: 'POST', 
        headers: await this.getHeaders(),
        body: JSON.stringify({ sitename }),
      })
      .then(response => response.json())
      .then(data => {
          _this.prev_site = data.sitename
          _this.site_key = data.key
      })
    },

     async updateSite() {
      const _this = this
      const sitename = this.new_site.trim()

      if(!this.validateWebsite(sitename)) return

      fetch(`${this.base_API}/sites/${this.site_key}`, {
        method: 'PUT', 
        headers: await this.getHeaders(),
        body: JSON.stringify({ sitename }),
      })
      .then(response => response.json())
      .then(data => {
          _this.prev_site = sitename
          _this.previewImage()
      })
    },

    async checkUserSite() {       
       const _this = this
       fetch(`${this.base_API}/sites`, { headers: await this.getHeaders() })
        .then(response => response.json())
        .then(function(data){ 
            const sites = data.items
            if(sites.length > 0) {
              const site = sites[0]
              _this.prev_site = site.sitename
              _this.new_site = _this.prev_site
              _this.site_key = site.key

              if(site.theme) {
                _this.theme.text_color = site.theme.text_color
                _this.theme.bg_color = site.theme.bg_color
                _this.theme.align = site.theme.align
                _this.theme.fontfamily = site.theme.fontfamily
                _this.theme.logo_src = (site.theme.logo_src) ? site.theme.logo_src : ''
                _this.theme.background_src = (site.theme.background_src) ? site.theme.background_src : ''
              }

              //Re-init image
              _this.previewImage()
            }

            _this.loading = false
        });
    },

    get_api_link() {
      let clean_url = this.new_site.replace('https://', '')
      
      if (clean_url.substring(clean_url.length-1) == "/")
        clean_url = clean_url.replace('/', '')

      let text_color = this.theme.text_color.replace('#', '')
      let bg_color = this.theme.bg_color.replace('#', '')

      let fontfamily = this.theme.fontfamily
      let align = this.theme.align
      
      let logo = ''
      if(this.theme.logo_src != '')
        logo = `&logo=${this.theme.logo_src}`

      let backgroundImg = ''
      if(this.theme.background_src != '')
        backgroundImg = `&bgimage=${this.theme.background_src}`
    
      this.api_link = `https://get.imagin.live/api?web=${clean_url}&color=${text_color}&bgcolor=${bg_color}&fontfamily=${fontfamily}&align=${align}${logo}${backgroundImg}&title=Imagine.. this is your amazing title`
    },


    async saveSetting() {
      const _this = this
      const data = {
        theme: {
          'text_color': this.theme.text_color,
          'bg_color': this.theme.bg_color,
          'logo_src': this.theme.logo_src,
          'background_src': this.theme.background_src,
          'fontfamily': this.theme.fontfamily,
          'align': this.theme.align
        }
      }

      fetch(`${this.base_API}/sites/theme/${this.site_key}`, {
        method: 'PUT', 
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
          _this.previewImage()
      })
    },

    previewImage() {
        this.get_api_link()
        this.iframe_src = this.api_link.replace('get.imagin.live/api', 'template.imagin.live')
    },

    copycode() {
      navigator.clipboard.writeText(this.api_link)
    }
  }
} 
</script>

